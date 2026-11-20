import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
};

export default function ProductsScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          'https://fakestoreapi.com/products',
        );

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log('Products error:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#168b45"
        />

        <Text style={styles.loadingText}>
          პროდუქტები იტვირთება...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🥬 Fresh Basket</Text>

      <Text style={styles.title}>
        ჩვენი პროდუქტები
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/details/[id]',
                params: {
                  id: item.id.toString(),
                },
              })
            }
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.info}>
              <Text
                style={styles.category}
                numberOfLines={1}
              >
                {item.category}
              </Text>

              <Text
                style={styles.productTitle}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text style={styles.price}>
                ${item.price.toFixed(2)}
              </Text>

              <Text style={styles.details}>
                დეტალების ნახვა →
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#effcf3',
  },

  logo: {
    textAlign: 'center',
    color: '#168b45',
    fontSize: 25,
    fontWeight: '800',
  },

  title: {
    marginTop: 10,
    marginBottom: 18,
    textAlign: 'center',
    color: '#123b25',
    fontSize: 25,
    fontWeight: '800',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 170,
    marginBottom: 16,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    shadowColor: '#126b38',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  image: {
    width: 110,
    height: 130,
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  category: {
    color: '#168b45',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  productTitle: {
    marginTop: 7,
    color: '#183d27',
    fontSize: 17,
    fontWeight: '700',
  },

  price: {
    marginTop: 10,
    color: '#d97706',
    fontSize: 20,
    fontWeight: '800',
  },

  details: {
    marginTop: 10,
    color: '#168b45',
    fontWeight: '700',
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
    fontSize: 16,
  },
});