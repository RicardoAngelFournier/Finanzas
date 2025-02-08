import React, { useState, useEffect } from "react";
import { StyleSheet, Image, FlatList, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/database/supabaseClient";  // Ensure you import your Supabase client


export default function CardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("Enero"); // Default to "January"
  const animationHeight = useSharedValue(0); // Shared value for height
  const [currentIndex, setCurrentIndex] = useState(0); // Track current swipe index
  const [cardData, setCardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the card ID from the route

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .single();

      const { data: transactionList, error: transactionError } = await supabase
        .from("transaction")
        .select("*")
        .eq("card", id)
        .order("date", { ascending: false });

      if (cardError || transactionError) {
        console.error("Error fetching data:", cardError || transactionError);
      } else {
        setCardData(card);
        setTransactions(transactionList);
        console.log(transactions)
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.name}</Text>
        <Text style={styles.transactionSubtitle}>{item.type}</Text>
        <Text style={styles.transactionSubtitle}>
          {new Date(item.date).toLocaleDateString()} | {new Date(item.date).toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>
        <Carousel
          width={width}
          height={width / 1.5}
          data={[{ type: "renderCard" }, { type: "graphSection" }, { type: "swipeableCard" }]} // Three slides
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setCurrentIndex(index)}
          pagingEnabled
          renderItem={({ index }) => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {index === 0 ? (
                <LinearGradient
                  colors={["#DED8E3", "#F4989C", "#A8DADC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.cardContainer, { width: width - 20, marginHorizontal: 10 }]}
                >
                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.totalBalanceText}>{cardData.name}</Text>
                      <Text style={styles.balanceAmount}>${cardData.balance.toFixed(2)}</Text>
                    </View>
                    <View>
                      <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="white" />
                    </View>
                  </View>
                  <View style={styles.cardNumberSection}>
                    <Text style={styles.cardNumber}>{cardData.ending.slice(0, 4)}</Text>
                    <Text style={styles.cardNumber}>••••</Text>
                    <Text style={styles.cardNumber}>••••</Text>
                    <Text style={styles.cardNumber}>{cardData.ending.slice(-4)}</Text>
                  </View>
                  <View style={styles.cardBottom}>
                    <View>
                      <Text style={styles.cardNameLabel}>Name</Text>
                      <Text style={styles.cardName}>{cardData.owner_name}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardExpLabel}>Exp</Text>
                      <Text style={styles.cardExpDate}>{cardData.exp_date}</Text>
                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <Text>Other Carousel Content</Text>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.periodSelector}>
        <Text style={styles.periodText}>{selectedPeriod}</Text>
        <TouchableOpacity onPress={() => alert("Open Period Selector")}>
          <Text style={styles.changePeriod}>Cambiar Periodo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionsList}
        ListHeaderComponent={<Text style={styles.listHeader}>Transacciones Recientes</Text>}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DED8E3",
  },
  backcard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: "#0C051D",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 30,
    height: height * 0.34,    
    marginBottom: 10,
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  periodText: {
    fontSize: 18,
    fontFamily: "Bold",
  },
  changePeriod: {
    fontSize: 14,
    color: "#957FEF",
    fontFamily: "Medium",
  },
  chevron: {
    fontSize: 20,
    color: "white",
  },
  expandableContainer: {
    overflow: "hidden",
  },
  detailText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Light",
    marginVertical: 2,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listHeader: {
    fontSize: 16,
    fontFamily: "Bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconBackground: {
    height: 40,
    width: 40,
    backgroundColor: "#957FEF",
    borderRadius: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: "Bold",
  },
  transactionSubtitle: {
    fontSize: 12,
    fontFamily: "Light",
    color: "gray",
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: "Bold",
    color: "red",
  },
  cardContainer: {
    borderRadius: 18,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: "90%", // Adjust based on your layout
    alignSelf: "center",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalBalanceText: {
    fontSize: 15,
    color: "#FFF",
    fontFamily: "Regular", // Adjust based on your fonts
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: "Medium",
    color: "#FFF",
  },
  cardNumberSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: "Bold",
    color: "#fff",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardNameLabel: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 5,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardExpLabel: {
    fontSize: 12,
    color: "#fff",
    textAlign: "right",
    marginBottom: 5,
  },
  cardExpDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right",
  },
});
