import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import * as yup from 'yup';

type LoginForm = {
  username: string;
  password: string;
};

const loginSchema = yup.object({
  username: yup
    .string()
    .required('მომხმარებლის სახელი აუცილებელია'),

  password: yup
    .string()
    .required('პაროლი აუცილებელია'),
});

export default function LoginScreen() {
  const router = useRouter();

  const [rememberMe, setRememberMe] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkSavedToken = async () => {
      const savedToken = await AsyncStorage.getItem('userToken');

      if (savedToken) {
        router.replace('/');
      } else {
        setCheckingAuth(false);
      }
    };

    void checkSavedToken();
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(
        'https://fakestoreapi.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.token) {
        Alert.alert(
          'შეცდომა',
          'მომხმარებლის სახელი ან პაროლი არასწორია.',
        );
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('userToken', result.token);
      } else {
        await AsyncStorage.removeItem('userToken');
      }

      router.replace('/');
    } catch {
      Alert.alert(
        'შეცდომა',
        'სერვერთან დაკავშირება ვერ მოხერხდა.',
      );
    }
  };

  const submitForm = () => {
    void handleSubmit(onSubmit)();
  };

  if (checkingAuth) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#168b45"
        />
        <Text style={styles.loadingText}>
          მოწმდება ავტორიზაცია...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🥬 Fresh Basket</Text>

        <Text style={styles.title}>ავტორიზაცია</Text>

        <Text style={styles.subtitle}>
          შედი შენს ანგარიშში
        </Text>

        <Text style={styles.label}>
          მომხმარებლის სახელი
        </Text>

        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="მაგ: johnd"
              placeholderTextColor="#8ca394"
              autoCapitalize="none"
            />
          )}
        />

        {errors.username && (
          <Text style={styles.error}>
            {errors.username.message}
          </Text>
        )}

        <Text style={styles.label}>პაროლი</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="შეიყვანე პაროლი"
              placeholderTextColor="#8ca394"
              secureTextEntry
            />
          )}
        />

        {errors.password && (
          <Text style={styles.error}>
            {errors.password.message}
          </Text>
        )}

        <Pressable
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxActive,
            ]}
          >
            {rememberMe && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>

          <Text style={styles.rememberText}>
            დამიმახსოვრე
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={submitForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              შესვლა
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push('/')}
        >
          <Text style={styles.registerText}>
            არ გაქვს ანგარიში? დარეგისტრირდი
          </Text>
        </Pressable>

        <Text style={styles.example}>
          სატესტო მონაცემები: johnd / m38rmF$
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#effcf3',
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

  card: {
    padding: 26,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    shadowColor: '#126b38',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },

  logo: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#168b45',
    marginBottom: 24,
  },

  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    color: '#123b25',
  },

  subtitle: {
    textAlign: 'center',
    color: '#71917e',
    marginTop: 8,
    marginBottom: 26,
    fontSize: 16,
  },

  label: {
    color: '#214c32',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#b8dfc4',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#183d27',
    backgroundColor: '#f7fff9',
    fontSize: 16,
  },

  error: {
    color: '#d62828',
    marginTop: 5,
    fontSize: 13,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#168b45',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#168b45',
  },

  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  rememberText: {
    marginLeft: 10,
    color: '#214c32',
    fontSize: 15,
  },

  button: {
    height: 54,
    marginTop: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#168b45',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  registerText: {
    textAlign: 'center',
    color: '#168b45',
    fontWeight: '700',
    marginTop: 22,
  },

  example: {
    textAlign: 'center',
    color: '#93a79a',
    fontSize: 12,
    marginTop: 20,
  },
});