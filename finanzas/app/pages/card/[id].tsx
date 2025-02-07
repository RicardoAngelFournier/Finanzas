import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CardDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the card ID from the route

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Details</Text>
      <Text style={styles.cardId}>Card ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardId: {
    fontSize: 18,
    marginTop: 10,
  },
});
