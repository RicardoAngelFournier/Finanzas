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
import { Avatar } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

const cardsData = [
  { id: '1', type: 'VISA', balance: 123456, account: '•••• 6917', colors: ["#DED8E3", "#DED8E3", "#957FEF"] },
  { id: '2', type: 'Savings account', balance: 10000, account: '•••• 4552', colors: ['#DED8E3', "#FAE1FA", '#A8DADC'] },
  { id: '3', type: 'Efectivo', balance: 1780, account: 'MXN', colors: ["#DED8E3", "#D6F6DD", "#A8DADC"] },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Background Card */}
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>
          <View style={styles.row3}>
            <Text style={{ fontFamily: 'Medium', fontSize: 20, color: "#DAC4F7"}} >ENERO 2025</Text>
              <Avatar
                  size={32}
                  rounded
                  title="RA"
                  containerStyle={{ backgroundColor: "#DAC4F7" }}
                />
          </View>
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
          <FontAwesome6 name="check-circle" size={15} color={"#DED8E3"}  />
          <Text style={styles.percentageText}> 30% of Your Expenses, Looks Good.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>


                    {/* Action Buttons */}
      <View style={[styles.actionsContainer, { marginTop: 0 }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="wallet" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="send" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cash" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time" size={24} color="#0C051D" />
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
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
                  <Feather name="plus" size={32} color="#000" />
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
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="integrated-circuit-chip" size={28} color="black" />
                  </View>                
                    <Text style={styles.cardBalance}>${item.balance}</Text>
                <Text style={styles.cardAccount}>{item.account}</Text>
                <FontAwesome6 name="cc-mastercard" size={24} style={{left:100}} color="black" />
              </LinearGradient>
            );
          }}
        />
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
            <Text style={styles.totalText}>$ 16,000.0</Text>
          </View>

          <View style={styles.divider2} />

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
            <Text style={styles.infoValueNegative}>- $ 0,000.00</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("pages/score")} // Navigate to the "score" screen
      >
      <View style={styles.footer}>
      {/* Blurred Background Letters */}
        <BlurView intensity={30} tint="default" style={styles.blurredTextContainer}>
          <Text style={styles.blurredText}>BB</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  backcard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: '#0C051D',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    color: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#D6F6DD',
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
  row3: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  expenseText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: '#fff',
  },
  debtText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: '#F4989C',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
  },
  progressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#957FEF',
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#A8DADC",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  actionText: {
    fontSize: 11,
    fontFamily: "Regular",
    marginTop: 5,
    color: "#0C051D",
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
    backgroundColor: '#DED8E3',
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
    fontFamily: "SemiBold",
    marginTop: 8,
  },
  divider: {
    width: 2,
    height: '90%',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  divider2: {
    width: 2,
    height: '90%',
    backgroundColor: '#000',
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
    fontFamily: "Medium",
    color: '#052224',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#052224',
    fontFamily: "Medium",
    marginLeft: 'auto',
  },
  infoValueNegative: {
    fontSize: 16,
    color: '#F56F6C',
    fontFamily: "Medium",
    marginLeft: 'auto',
  },
  cardsSection: {
    marginVertical: 15,
    
  },
  cardItem: {
    width: cardWidth,
    height: 150,
    borderRadius: 18,
    padding: 12,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardType: {
    fontSize: 12,
    fontFamily: "Bold",
    color: "#000",
  },
  cardBalance: {
    fontSize: 20,
    fontFamily: "Light",
    color: "#000",
  },
  cardAccount: {
    fontSize: 12,
    fontFamily: "Black",
    color: "#000",
  },
  addCard: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: "10",
    backgroundColor: '#0C051D',
    borderRadius: 16,
    padding: 15,
    overflow: 'hidden', // Ensures no overflow outside the card
    borderColor: "#DED8E3",
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
    color: '#957FEF',
    opacity: 0.90,
    transform: [{ rotate: '-15deg' }], // Add rotation if needed
  },
  footerText: {
    fontSize: 32,
    alignSelf: "flex-start",
    fontFamily: "SemiBold",
    color: '#E6E8FF',
  },
  footerDescription: {
    fontSize: 13,
    color: '#E6E8FF',
    alignSelf: "flex-start",
    fontFamily: "Regular",
    textAlign: 'justify',
    marginTop: 8,
  },
  bottomInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DED8E3',
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
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 16, // Ensures there’s space below the content
  },


});
