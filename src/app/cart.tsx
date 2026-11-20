import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    const savedCart = await AsyncStorage.getItem('cart');
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  async function updateCart(updatedCart: CartItem[]) {
    setCart(updatedCart);

    if (updatedCart.length === 0) {
      await AsyncStorage.removeItem('cart');
    } else {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  }

  async function increaseQuantity(id: number) {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    await updateCart(updatedCart);
  }

  async function decreaseQuantity(id: number) {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    await updateCart(updatedCart);
  }

  async function removeItem(id: number) {
    const updatedCart = cart.filter((item) => item.id !== id);
    await updateCart(updatedCart);
  }

  async function clearCart() {
    await AsyncStorage.removeItem('cart');
    setCart([]);
  }

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.logo}>🥬 Fresh Basket</Text>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>კალათა ცარიელია</Text>
        <Text style={styles.emptyText}>
          დაამატე პროდუქტი პროდუქტების გვერდიდან.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>🥬 Fresh Basket</Text>
      <Text style={styles.title}>ჩემი კალათა</Text>

      {cart.map((item) => (
        <View style={styles.card} key={item.id}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.details}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.price}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>

            <View style={styles.actions}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Text style={styles.quantityText}>−</Text>
              </Pressable>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <Pressable
                style={styles.quantityButton}
                onPress={() => increaseQuantity(item.id)}
              >
                <Text style={styles.quantityText}>+</Text>
              </Pressable>

              <Pressable onPress={() => removeItem(item.id)}>
                <Text style={styles.removeText}>წაშლა</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>შეკვეთის შეჯამება</Text>

        <View style={styles.row}>
          <Text>პროდუქტების რაოდენობა:</Text>
          <Text style={styles.bold}>{totalQuantity}</Text>
        </View>

        <View style={styles.row}>
          <Text>საერთო ფასი:</Text>
          <Text style={styles.total}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <Pressable style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.buttonText}>კალათის გასუფთავება</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#effcf3',
    padding: 24,
    paddingTop: 55,
  },
  logo: {
    textAlign: 'center',
    color: '#159447',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },
  title: {
    textAlign: 'center',
    color: '#126b35',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 100,
    resizeMode: 'contain',
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  productTitle: {
    color: '#123b25',
    fontSize: 16,
    fontWeight: '700',
  },
  price: {
    color: '#e07800',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  quantityButton: {
    backgroundColor: '#159447',
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '700',
  },
  removeText: {
    color: '#e52323',
    fontWeight: '700',
  },
  summary: {
    backgroundColor: '#d8f7df',
    borderRadius: 20,
    padding: 22,
    marginTop: 12,
    marginBottom: 30,
  },
  summaryTitle: {
    color: '#126b35',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  bold: {
    fontWeight: '800',
  },
  total: {
    color: '#159447',
    fontSize: 22,
    fontWeight: '800',
  },
  clearButton: {
    backgroundColor: '#e52323',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#effcf3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 65,
    marginTop: 30,
  },
  emptyTitle: {
    color: '#126b35',
    fontSize: 25,
    fontWeight: '800',
    marginTop: 15,
  },
  emptyText: {
    color: '#52705d',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});