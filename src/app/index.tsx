import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const sections = [
  {
    title: '🍎 ხილი',
    data: ['🍎 ვაშლი', '🍌 ბანანი', '🍊 ფორთოხალი'],
  },
  {
    title: '🥕 ბოსტნეული',
    data: ['🥕 სტაფილო', '🥔 კარტოფილი', '🍅 პომიდორი'],
  },
];

export default function HomeScreen() {
  const [isDark, setIsDark] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  function handleItemPress(item: string) {
    if (Platform.OS === 'web') {
      window.alert(`✅ შენ აირჩიე: ${item}`);
    } else {
      Alert.alert('✅ არჩეული პროდუქტი', `შენ აირჩიე: ${item}`);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingEmoji}>🛒</Text>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>იტვირთება...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={styles.logo}>🥬 Fresh Basket</Text>
        <Text style={styles.subtitle}>სუფთა და ჯანსაღი არჩევანი</Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={[styles.modeText, isDark && styles.darkText]}>
          {isDark ? '🌙 მუქი რეჟიმი' : '☀️ ნათელი რეჟიმი'}
        </Text>

        <Switch
          value={isDark}
          onValueChange={setIsDark}
          trackColor={{ false: '#bbf7d0', true: '#4ade80' }}
          thumbColor={isDark ? '#166534' : '#ffffff'}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
            onPress={() => handleItemPress(item)}
          >
            <Text style={[styles.itemText, isDark && styles.darkText]}>
              {item}
            </Text>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>🛒 კალათის ნახვა</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🛒</Text>

            <Text style={styles.modalTitle}>თქვენი კალათა</Text>

            <Text style={styles.modalText}>
              კალათა ჯერ ცარიელია. აირჩიეთ სასურველი პროდუქტი.
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>დახურვა</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 55,
    backgroundColor: '#f0fdf4',
  },

  darkContainer: {
    backgroundColor: '#17251b',
  },

  header: {
    backgroundColor: '#16a34a',
    padding: 22,
    borderRadius: 24,
    marginBottom: 22,
    shadowColor: '#166534',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  logo: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: '#dcfce7',
    fontSize: 15,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },

  modeText: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '600',
  },

  darkText: {
    color: '#ffffff',
  },

  sectionHeader: {
    color: '#166534',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#bbf7d0',
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 6,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    marginVertical: 5,
    borderRadius: 16,
    shadowColor: '#166534',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  itemPressed: {
    backgroundColor: '#dcfce7',
    transform: [{ scale: 0.98 }],
  },

  itemText: {
    color: '#14532d',
    fontSize: 17,
    fontWeight: '600',
  },

  arrow: {
    color: '#16a34a',
    fontSize: 28,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#166534',
    padding: 17,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonPressed: {
    backgroundColor: '#15803d',
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0fdf4',
  },

  loadingEmoji: {
    fontSize: 55,
  },

  loadingText: {
    color: '#166534',
    fontSize: 18,
    fontWeight: '600',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },

  modalBox: {
    width: '84%',
    padding: 28,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  modalEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  modalTitle: {
    color: '#166534',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  modalText: {
    color: '#374151',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  closeButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 22,
  },
});