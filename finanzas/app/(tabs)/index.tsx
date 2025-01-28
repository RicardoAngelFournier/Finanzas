import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";

const cardsData = [
  { id: '1', type: 'VISA', balance: 123456, account: '•••• 6917', colors: ['#B2D0CE', '#7C57FF'] },
  { id: '2', type: 'Savings account', balance: 10000, account: '•••• 4552', colors: ['#8080ff', '#21CBF3'] },
  { id: '3', type: 'VISA', balance: 1780, account: '•••• 9934', colors: ['#FF9800', '#F1FE87'] },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Background Card */}
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={{ fontFamily: 'Medium', fontSize: 20 }} >ENERO 2025</Text>
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
          <View style={styles.divider} />
          <Text style={styles.debtText}>- $1,187.40</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
         <View style={styles.row2}>
          <FontAwesome6 name="check-circle" size={15} color={"#0C3B35"}  />
          <Text style={styles.percentageText}> 30% of Your Expenses, Looks Good.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

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
            <Text style={styles.totalText}>$000,800.0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rightSection}>
            <View style={styles.infoRow}>
              <Feather name="arrow-up-circle" size={32} color="#052224" />
              <Text style={styles.infoText}>Ahorro este mes</Text>
            </View>
            <Text style={styles.infoValue}>$ 0,000.00</Text>

            <View style={styles.infoRow}>
              <Feather name="arrow-down-circle" size={32} color="#052224" />
              <Text style={styles.infoText}>Retiros este mes</Text>
            </View>
            <Text style={styles.infoValueNegative}>- $ 100.00</Text>
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

      <TouchableOpacity
        onPress={() => router.push("pages/score")} // Navigate to the "score" screen
      >
      <View style={styles.footer}>
      {/* Blurred Background Letters */}
        <BlurView intensity={30} tint="default" experimentalBlurMethod="dimezisBlurView" style={styles.blurredTextContainer}>
          <Text style={styles.blurredText}>AA</Text>
        </BlurView>

        {/* Score and Description */}
        <View style={[styles.row, { flexDirection: "row" }]}>
          <Text style={styles.footerText}>0.780</Text>
          <Text style={styles.footerText}>AA</Text>
        </View>
        <Text style={styles.footerDescription}>
          Consider reviewing expenses for possible reductions. Avoid unnecessary large purchases or debt accumulation. Focus on maintaining a stable balance between savings and spending.
        </Text>
    </View>
    </TouchableOpacity>

        <View style={styles.bottomInfoSection}>
          <View style={styles.bottomInfoCard}>
            <Text style={styles.bottomInfoTitle}>Spare</Text>
            <Text style={styles.bottomInfoValue}>$400.0</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.bottomInfoCard}>
            <Text style={styles.bottomInfoTitle}>Spare siguientes 7 días</Text>
            <Text style={styles.bottomInfoValue}>$400.0</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.bottomInfoCard}>
            <Text style={styles.bottomInfoTitle}>Spare siguiente pago</Text>
            <Text style={styles.bottomInfoValue}>$900.0</Text>
          </View>
      </View>

      </ScrollView>

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
    backgroundColor: '#C0B3DE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#0C3B35',
    fontFamily: "Medium", 
  },
  expenseSection: {
    marginBottom: 25,
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
    fontFamily: "Bold",
    color: '#0D2653',
  },
  debtText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: '#00368C',
  },
  progressBarContainer: {
    height: 14,
    backgroundColor: '#F1FFF3',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
  },
  progressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#000',
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: '#0C3B35',
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
    backgroundColor: '#D9D9D9',
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
    backgroundColor: '#A8DADC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressImage: {
    width: 60,
    height: 60,
  },
  totalText: {
    fontSize: 19,
    fontFamily: "Regular",
    marginTop: 8,
  },
  divider: {
    width: 2,
    height: '90%',
    backgroundColor: '#fff',
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
    fontFamily: "Light",
    color: '#052224',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#052224',
    fontFamily: "Light",
    marginLeft: 'auto',
  },
  infoValueNegative: {
    fontSize: 16,
    color: '#00368C',
    fontFamily: "Light",
    marginLeft: 'auto',
  },
  cardsSection: {
    marginVertical: 15,
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
    fontSize: 13,
    fontFamily: "Regular",
    color: '#333',
  },
  cardBalance: {
    fontSize: 20,
    fontFamily: "Regular",
    color: '#000',
  },
  cardAccount: {
    fontSize: 12,
    fontFamily: "Light",
    color: '#000',
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
    marginTop: "10",
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 15,
    overflow: 'hidden', // Ensures no overflow outside the card
    borderColor: "#b6d7a8",
    borderWidth: 2
  },
  blurredTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Push it behind other content
  },
  blurredText: {
    fontSize: 120,
    fontFamily: "Bold",
    color: '#b6d7a8',
    opacity: 0.90,
    transform: [{ rotate: '-15deg' }], // Add rotation if needed
  },
  footerText: {
    fontSize: 32,
    alignSelf: "flex-start",
    fontFamily: "SemiBold",
    color: '#000',
  },
  footerDescription: {
    fontSize: 13,
    color: '#000',
    alignSelf: "flex-start",
    fontFamily: "Regular",
    textAlign: 'justify',
    marginTop: 8,
  },
  bottomInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6E8FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  bottomInfoCard: {
    flex: 1,
    alignItems: 'center',
  },
  bottomInfoTitle: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Light',
    textAlign: 'center',
  },
  bottomInfoValue: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Bold',
    marginTop: 5,
  },
  dividerVertical: {
    width: 2,
    height: '70%',
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 16, // Ensures there’s space below the content
  },


});
