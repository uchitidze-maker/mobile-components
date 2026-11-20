import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('profileImage').then(setImage);
  }, []);

  async function chooseImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'ნებართვა საჭიროა',
        'პროფილის ფოტოს ასარჩევად გალერეაზე წვდომა ჩართე.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      await AsyncStorage.setItem('profileImage', selectedImage);
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ჩემი პროფილი</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={chooseImage}>
        <Text style={styles.buttonText}>პროფილის ფოტოს არჩევა</Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fresh Basket მომხმარებელი</Text>
        <Text style={styles.infoText}>
          აქ შეგიძლია შეცვალო პროფილის ფოტო ან გამოხვიდე ანგარიშიდან.
        </Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>გასვლა</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#effcf3',
    padding: 24,
    paddingTop: 70,
    alignItems: 'center',
  },
  title: {
    color: '#126b35',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 25,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#b9f2cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarText: {
    fontSize: 65,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#159447',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginTop: 24,
  },
  infoTitle: {
    color: '#126b35',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    color: '#52705d',
    fontSize: 15,
    lineHeight: 22,
  },
});