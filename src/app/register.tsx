import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import * as yup from 'yup';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SavedUser = RegisterForm & {
  id: string;
};

const registerSchema = yup.object({
  name: yup
    .string()
    .required('სახელის შეყვანა აუცილებელია')
    .min(2, 'სახელი ძალიან მოკლეა'),

  email: yup
    .string()
    .required('ელფოსტა აუცილებელია')
    .email('შეიყვანე სწორი ელფოსტა'),

  password: yup
    .string()
    .required('პაროლი აუცილებელია')
    .min(6, 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს'),

  confirmPassword: yup
    .string()
    .required('დაადასტურე პაროლი')
    .oneOf([yup.ref('password')], 'პაროლები არ ემთხვევა'),
});

export default function RegisterScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const savedUsers = await AsyncStorage.getItem('users');

      const users: SavedUser[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      const alreadyExists = users.some(
        (user) => user.email === data.email,
      );

      if (alreadyExists) {
        Alert.alert(
          'შეცდომა',
          'ეს ელფოსტა უკვე რეგისტრირებულია.',
        );
        return;
      }

      const newUser: SavedUser = {
        ...data,
        id: Date.now().toString(),
      };

      await AsyncStorage.setItem(
        'users',
        JSON.stringify([...users, newUser]),
      );

      Alert.alert(
        'წარმატება',
        'რეგისტრაცია წარმატებით დასრულდა.',
        [
          {
            text: 'Login-ზე გადასვლა',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch {
      Alert.alert(
        'შეცდომა',
        'რეგისტრაცია ვერ შესრულდა.',
      );
    }
  };

  const submitForm = () => {
    void handleSubmit(onSubmit)();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🥬 Fresh Basket</Text>

        <Text style={styles.title}>რეგისტრაცია</Text>

        <Text style={styles.subtitle}>
          შექმენი ახალი ანგარიში
        </Text>

        <Text style={styles.label}>სახელი</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="შეიყვანე სახელი"
              placeholderTextColor="#8ca394"
            />
          )}
        />

        {errors.name && (
          <Text style={styles.error}>
            {errors.name.message}
          </Text>
        )}

        <Text style={styles.label}>ელფოსტა</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="example@email.com"
              placeholderTextColor="#8ca394"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {errors.email && (
          <Text style={styles.error}>
            {errors.email.message}
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
              placeholder="მინიმუმ 6 სიმბოლო"
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

        <Text style={styles.label}>
          გაიმეორე პაროლი
        </Text>

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="გაიმეორე პაროლი"
              placeholderTextColor="#8ca394"
              secureTextEntry
            />
          )}
        />

        {errors.confirmPassword && (
          <Text style={styles.error}>
            {errors.confirmPassword.message}
          </Text>
        )}

        <Pressable
          style={[
            styles.button,
            isSubmitting && styles.disabledButton,
          ]}
          onPress={submitForm}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            რეგისტრაცია
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginText}>
            უკვე გაქვს ანგარიში? შედი
          </Text>
        </Pressable>
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
    marginBottom: 18,
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
    marginBottom: 18,
    fontSize: 16,
  },

  label: {
    color: '#214c32',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    height: 50,
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
    marginTop: 4,
    fontSize: 13,
  },

  button: {
    height: 54,
    marginTop: 22,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#168b45',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  loginText: {
    textAlign: 'center',
    color: '#168b45',
    fontWeight: '700',
    marginTop: 20,
  },
});