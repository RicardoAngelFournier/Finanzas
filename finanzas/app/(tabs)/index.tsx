import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const cardsData = [
  { id: '1', type: 'VISA', balance: 2230, account: '**** 6917', colors: ['#B2D0CE', '#7C57FF'] },
  { id: '2', type: 'Savings account', balance: 5566, account: '**** 4552', colors: ['#8080ff', '#21CBF3'] },
  { id: '3', type: 'VISA', balance: 1780, account: '**** 9934', colors: ['#FF9800', '#F1FE87'] },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Background Card */}
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={{ fontFamily: 'Medium' }} >ENERO 2025</Text>
        <Text style={styles.subtitle}>Buenos días Ricardo</Text>
      </View>

      {/* Expense Section */}
      <View style={styles.expenseSection}>
        <View style={styles.row}>
          <Text style={styles.subtitle}>Balance Total</Text>
          <Text style={styles.subtitle}>Deuda Total</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.expenseText}>$7,783.00</Text>
          <Text style={styles.debtText}>- $1,187.40</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
         <View style={styles.row2}>
          <FontAwesome6 name="check-circle" size={15} color={"#777"}  />
          <Text style={styles.percentageText}> 30% of Your Expenses, Looks Good.</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <View style={styles.circularProgress}>
              <Image
                source={require('../../assets/images/placeholder.png')}
                style={styles.progressImage}
              />
            </View>
            <Text style={styles.totalText}>$16,800.0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rightSection}>
            <View style={styles.infoRow}>
              <Feather name="arrow-up-circle" size={36} color="black" />
              <Text style={styles.infoText}>Ahorro este mes</Text>
            </View>
            <Text style={styles.infoValue}>$4,000.00</Text>

            <View style={styles.infoRow}>
              <Feather name="arrow-down-circle" size={36} color="black" />
              <Text style={styles.infoText}>Deducciones mes</Text>
            </View>
            <Text style={styles.infoValueNegative}>- $100.00</Text>
          </View>
        </View>
      </View>

    {/* Cards Section */}
    <View style={styles.cardsSection}>
        <FlatList
          data={[...cardsData, { id: 'add' }]} // Include an "Add" card
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.id === 'add') {
              // Add Card
              return (
                <TouchableOpacity style={styles.addCard}>
                  <Feather name="plus" size={32} color="#555" />
                </TouchableOpacity>
              );
            }
            // Regular Cards with Gradient
            return (
              <LinearGradient
                colors={item.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardItem}
              >
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardBalance}>${item.balance}</Text>
                <Text style={styles.cardAccount}>{item.account}</Text>
                <FontAwesome6 name="cc-mastercard" size={24} style={{left:100}} color="black" />
              </LinearGradient>
            );
          }}
        />
      </View>


      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>AA+ Continue Monitoring Expenses</Text>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FAEE',
    paddingHorizontal: 16,
  },
  backcard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: '#EBCBE3',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  expenseSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  expenseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#052224',
  },
  debtText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0068FF',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    width: '30%',
    height: '100%',
    backgroundColor: '#052224',
  },
  percentageText: {
    fontSize: 14,
    color: '#777',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 32,
    backgroundColor: '#A8DADC',
    borderRadius: 28,
    padding: 16,
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressImage: {
    width: 60,
    height: 60,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  divider: {
    width: 2,
    height: '90%',
    backgroundColor: '#AAA',
    marginHorizontal: 16,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#052224',
    marginLeft: 'auto',
  },
  infoValueNegative: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0068FF',
    marginLeft: 'auto',
  },
  cardsSection: {
    marginVertical: 20,
  },
  cardItem: {
    width: cardWidth,
    height: 120,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  cardType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cardAccount: {
    fontSize: 12,
    color: '#666',
  },
  addCard: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
