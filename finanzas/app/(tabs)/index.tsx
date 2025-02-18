
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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "@/database/supabaseClient";
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Skeleton } from '@rneui/themed';
import { Link } from 'expo-router';
import { createContext, useContext, useEffect } from 'react';
import { PieChart } from "react-native-gifted-charts";

const CardsContext = createContext(null);

export default function HomeScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<{
    id: number;
    name: string;
    bank: string;
    ending: string;
    expiration: string;
    color: string;
    balance?: number;  // Optional field based on your API response
  }[]>([]);

    const pieData = [
      {value: 70, color: '#a86efa'},
      {value: 30, color: 'black'}
  ];

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    loadCards();  // Fetch cards when the app loads
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true); // Set loading to true when starting to load cards
      const { data, error } = await supabase
        .from("cards")
        .select("id, name, bank, ending, expiration, color, type, balance, issuer");

      if (error) {
        console.error("Error loading cards:", error);
        setCards([]);  // Ensure cards is set to an empty array if there's an error
      } else {
        console.log("sucessful"); // Log data to check if it's fetched correctly
        console.log(data); // Log data to check if it's fetched correctly
        setCards(data || []); // Ensure cards is set to an empty array if no data
      }
    } catch (error) {
      console.error("Unexpected error loading cards:", error);
      setCards([]);  // Ensure cards is set to an empty array in case of unexpected error
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Card */}
      <View style={styles.backcard} />
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.row3}>
          <Text style={{ fontFamily: 'Medium', fontSize: 20, color: "#9B7EDE" }} >ENERO 2025</Text>
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
          <Text style={styles.expenseText}>$12,200.00</Text>
          <View style={styles.divider} />
          <Text style={styles.debtText}>- $4,187.40</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
        <View style={styles.row2}>
          <Text style={styles.percentageText}> 30% of Your Expenses, Looks Good.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Action Buttons */}
        <View style={[styles.actionsContainer, { marginTop: 0 }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="wallet" size={24} color="#273469" />
            <Text style={styles.actionText}>Nuev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="cash-plus" size={26} color="#273469" />
            <Text style={styles.actionText}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="donate" size={24} color="#273469" />
            <Text style={styles.actionText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("pages/cardstest")}>
            <Ionicons name="time" size={24} color="#273469" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsSection}>
          {loading ? (
            <View style={styles.card}>
              <Skeleton animation="pulse" width={80} height={40} />
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={80}
                height={40}
              />
            </View>
          ) : cards.length === 0 ? (
            <TouchableOpacity style={styles.addCard} onPress={() => router.push("pages/newcard")}>
              <Feather name="plus" size={32} color="#000" />
            </TouchableOpacity>
          ) : (
            <FlatList
              data={[...cards, { id: 'add' }]}  // Include the "Add Card" as part of the data
              keyExtractor={(item) => item.id.toString()}  // Ensure unique key extraction
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                if (item.id === 'add') {
                  // Add Card Button
                  return (
                    <TouchableOpacity style={styles.addCard} onPress={() => router.push("pages/newcard")}>
                      <Feather name="plus" size={32} color="#000" />
                    </TouchableOpacity>
                  );
                }
                // Determine the icon to show based on the issuer
                let issuerIcon;
                if (item.issuer === "mastercard") {
                  issuerIcon = <FontAwesome6 name="cc-mastercard" size={24} color="black" />;
                } else if (item.issuer === "visa") {
                  issuerIcon = <FontAwesome6 name="cc-visa" size={24} color="black" />;
                } else {
                  issuerIcon = <MaterialCommunityIcons name="credit-card" size={24} color="black" />;
                }

                // Determine which chip or wallet icon to show based on card type
                const cardIcon = (item.type === 3 || item.type === 4) ? (
                  <MaterialCommunityIcons name="wallet" size={28} color="black" />
                ) : (
                  <MaterialCommunityIcons name="integrated-circuit-chip" size={28} color="black" />
                );

                return (
                  <Link
                    href={{
                      pathname: '/pages/card/[id]',  // Correct relative path
                      params: { id: item.id },       // Pass the actual card id
                    }}
                  >
                    <LinearGradient
                      colors={["#fff", item.color, "#A8DADC"]}  // Colors as an array
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1., y: 1.2 }}
                      style={styles.cardItem}
                    >
                      <View style={styles.row3}>
                        <Text style={styles.cardType}>{item.name}</Text>
                        {cardIcon}  {/* Show the chip or wallet icon */}
                      </View>
                      <Text style={styles.cardBalance}>${item.balance}</Text>
                      <Text style={styles.cardAccount}>{item.bank}</Text>
                      {issuerIcon}  {/* Show the issuer's card icon */}
                    </LinearGradient>
                  </Link>
                );
              }}
            />
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <PieChart
                donut
                radius={35}
                innerRadius={20}
                data={pieData}
                centerLabelComponent={() => {
                return <Text style={{fontSize: 14, fontFamily: "Bold"}}>22%</Text>;
                }}
            />
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
    backgroundColor: '#E6E8FF',
    borderRadius: 40
  },
  header: {
    marginTop: 40,
    color: '#000',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
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
    color: '#000',
  },
  debtText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: '#D72638',
  },
  progressBarContainer: {
    height: 15,
    backgroundColor: '#D72638',
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 15,
  },
  progressBar: {
    width: '68%',
    height: '100%',
    backgroundColor: '#a86efa',
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Medium",
    color: '#000',
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#FAFAFF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 80,
    height: 90,
    borderColor: "#DED8E3",
    borderWidth: 2
  },
  actionText: {
    fontSize: 11,
    fontFamily: "Medium",
    marginTop: 5,
    color: "#273469",
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
    backgroundColor: '#FAFAFF',
    borderRadius: 20,
    padding: 14,
    borderColor: "#DED8E3",
    borderWidth: 2
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9B7EDE',
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
    backgroundColor: '#000',
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
    color: '#22333B',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#22333B',
    fontFamily: "Medium",
    marginLeft: 'auto',
  },
  infoValueNegative: {
    fontSize: 16,
    color: '#D72638',
    fontFamily: "Medium",
    marginLeft: 'auto',
  },
  cardsSection: {
    marginVertical: 15,

  },
  cardItem: {
    width: cardWidth,
    height: 150,
    borderRadius: 20,
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
    height: 150,
    borderRadius: 20,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: "10",
    backgroundColor: '#FAFAFF',
    borderRadius: 20,
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
    opacity: 0.80,
    transform: [{ rotate: '-15deg' }], // Add rotation if needed
  },
  footerText: {
    fontSize: 32,
    alignSelf: "flex-start",
    fontFamily: "SemiBold",
    color: '#22333B',
  },
  footerDescription: {
    fontSize: 13,
    color: '#22333B',
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
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
