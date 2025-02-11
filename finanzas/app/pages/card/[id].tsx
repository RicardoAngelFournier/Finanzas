import React, { useState, useEffect } from "react";
import { StyleSheet, Image, FlatList, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/database/supabaseClient";  // Ensure you import your Supabase client
import { Skeleton } from "@rneui/themed";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Dialog } from "@rneui/themed";

export default function CardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("Enero"); // Default to "January"
  const [currentIndex, setCurrentIndex] = useState(0); // Track current swipe index
  const [cardData, setCardData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible1, setVisible1] = useState(false);

  const [date, setDate] = useState(dayjs());

  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the card ID from the route

  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch card data
      const { data: card, error: cardError } = await supabase.from("cards").select("*").eq("id", id).single();

      // Fetch transaction data
      const { data: transactionList, error: transactionError } = await supabase
        .from("transaction")
        .select("*")
        .eq("card", id)
        .order("date", { ascending: false });

      // Fetch category data
      const { data: categories, error: categoryError } = await supabase.from("category").select("*");

      if (cardError || transactionError || categoryError) {
        console.error("Error fetching data:", cardError || transactionError || categoryError);
      } else {
        setCardData(card);

        // Map category data to transactions
        const transactionsWithCategory = transactionList.map((transaction) => {
          const category = categories.find((cat) => cat.id === transaction.category);
          return {
            ...transaction,
            categoryEmoji: category ? category.emoji : "❓", // Fallback emoji if category not found
          };
        });

        setTransactions(transactionsWithCategory);

        // Calculate total spent per category for the pie chart
        const categoryTotals = categories.map((category) => {
          const total = transactionsWithCategory
            .filter((transaction) => transaction.category === category.id)
            .reduce((sum, transaction) => sum + transaction.amount, 0);

          return {
            name: category.name,
            value: total,
            color: category.color || generateRandomColor(),
            gradientCenterColor: category.color || "#FFFFFF",
          };
        });

        setPieData(categoryTotals.filter((item) => item.value > 0)); // Remove categories with 0 value
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);


  // Helper function to generate a random color (optional)
const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
  
const renderTransactionItem = ({ item }) => (
  <View style={styles.transactionCard}>
    <View style={styles.iconContainer}>
      <View style={styles.iconBackground}>
        <Text style={{ fontSize: 24 }}>{item.categoryEmoji}</Text>
      </View>
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
        <View style={styles.backcard} />
        <View style={styles.header}>
          <LinearGradient
            colors={["#DED8E3", "#DED8E3", "#DED8E3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.cardContainer, { width: width - 20, marginHorizontal: 10 }]}
          >
            <Text style={styles.balanceAmount}>Cargando...</Text>
            <View style={styles.cardTop}>
              <View>
                <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="white" />
              </View>
            </View>
            <View style={styles.cardNumberSection}>
              <Text style={styles.cardNumber}>cargando</Text>
              <Text style={styles.cardNumber}>••••</Text>
              <Text style={styles.cardNumber}>••••</Text>
              <Text style={styles.cardNumber}>cargando</Text>
            </View>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardNameLabel}>Name</Text>
                <Text style={styles.cardName}>cargando</Text>
              </View>
              <View>
                <Text style={styles.cardExpLabel}>Exp</Text>
                <Text style={styles.cardExpDate}>cargando</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.transactionsList}>
          <Skeleton animation="pulse" width={80} height={40} />
        </View>
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
                  colors={["#DED8E3", cardData.color || "#FFFFFF", "#A8DADC"]}
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
                      <Text style={styles.cardName}>{cardData.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardExpLabel}>Exp</Text>
                      <Text style={styles.cardExpDate}>{cardData.expiration}</Text>
                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <LinearGradient
                colors={["#DED8E3", cardData.color || "#FFFFFF", "#A8DADC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardContainer}
              >
                <Text style={{ fontSize: 20, color: "white", fontFamily: "Bold" }}>
                  {cardData.name}
                </Text>
                <View style={{ padding: 5, alignItems: "center" }}>
                  <PieChart
                    data={pieData}
                    isAnimated
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={80}
                    innerRadius={50}
                    innerCircleColor={"#232B5D"}
                    centerLabelComponent={() => {
                      const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
                      return (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                          <Text style={{ fontSize: 22, color: "white", fontFamily: "Regular" }}>
                            {totalValue}
                          </Text>
                          <Text style={{ fontSize: 12, color: "white", fontFamily: "Regular" }}>
                            Total
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              </LinearGradient>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.periodSelector}>
        <Text style={styles.periodText}>{selectedPeriod}</Text>
        <TouchableOpacity onPress={toggleDialog1}>
          <Text style={styles.changePeriod}>Cambiar Periodo</Text>
        </TouchableOpacity>
      </View>

      <Dialog
      isVisible={visible1}
      onBackdropPress={toggleDialog1}
    >
      <Dialog.Title title="Dialog Title"/>
      <DateTimePicker
        mode="range"
        initialView="month"
        date={date}
        onChange={(params) => setDate(params.date)}
      />
    </Dialog>

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
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 45,
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
