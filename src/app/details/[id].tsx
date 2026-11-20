import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`,
        );

        const data = await response.json();
        setProduct(data);
      } catch {
        Alert.alert(
          'შეცდომა',
          'პროდუქტის ჩატვირთვა ვერ მოხერხდა.',
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) {
      return;
    }

    const savedCart = await AsyncStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingProduct = cart.find(
      (item: Product & { quantity: number }) =>
        item.id === product.id,
    );

    const updatedCart = existingProduct
      ? cart.map((item: Product & { quantity: number }) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...product, quantity: 1 }];

    await AsyncStorage.setItem(
      'cart',
      JSON.stringify(updatedCart),
    );

    Alert.alert(
      'დამატებულია',
      'პროდუქტი კალათაში დაემატა.',
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#168b45"
        />

        <Text style={styles.loadingText}>
          იტვირთება...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loading}>
        <Text>პროდუქტი ვერ მოიძებნა.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← უკან</Text>
      </Pressable>

      <View style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.category}>
          {product.category}
        </Text>

        <Text style={styles.title}>
          {product.title}
        </Text>

        <Text style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

        <Pressable
          style={styles.button}
          onPress={addToCart}
        >
          <Text style={styles.buttonText}>
            🛒 კალათაში დამატება
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#effcf3',
  },

  backButton: {
    marginBottom: 18,
  },

  backText: {
    color: '#168b45',
    fontSize: 17,
    fontWeight: '700',
  },

  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },

  image: {
    width: '100%',
    height: 280,
  },

  category: {
    marginTop: 20,
    color: '#168b45',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  title: {
    marginTop: 10,
    color: '#123b25',
    fontSize: 24,
    fontWeight: '800',
  },

  price: {
    marginTop: 14,
    color: '#d97706',
    fontSize: 26,
    fontWeight: '800',
  },

  description: {
    marginTop: 18,
    color: '#52665a',
    fontSize: 16,
    lineHeight: 25,
  },

  button: {
    marginTop: 26,
    padding: 17,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#168b45',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#effcf3',
  },

  loadingText: {
    marginTop: 12,
    color: '#168b45',
  },
});