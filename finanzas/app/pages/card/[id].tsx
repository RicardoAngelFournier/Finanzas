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
import { Dialog } from "@rneui/themed";
import CustomDatePicker from "@/components/CalendarPicker";
import dayjs from "dayjs";
import BlankCard from "@/components/ui/BlankCard";
import { SpeedDial } from "@rneui/themed";

export default function CardScreen() {
  const [currentIndex, setCurrentIndex] = useState(0); // Track current swipe index
  const [cardData, setCardData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible1, setVisible1] = useState(false);
  const [open, setOpen] = React.useState(false);

  const [roundedValue, setRoundedValue] = useState(0); // State to store the rounded value

  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the card ID from the route

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate(),
  });

  const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: card, error: cardError } = await supabase.from("cards").select("*").eq("id", id).single();
      const { data: transactionList, error: transactionError } = await supabase
        .from("transaction")
        .select("*")
        .eq("card", id)
        .order("date", { ascending: false });
      const { data: categories, error: categoryError } = await supabase.from("category").select("*");

      if (cardError || transactionError || categoryError) {
        console.error("Error fetching data:", cardError || transactionError || categoryError);
      } else {
        setCardData(card);

        const filteredTransactions = filterTransactionsByDateRange(
          transactionList,
          selectedDateRange.startDate,
          selectedDateRange.endDate
        );

        const transactionsWithCategory = filteredTransactions.map((transaction) => {
          const category = categories.find((cat) => cat.id === transaction.category);
          return {
            ...transaction,
            categoryEmoji: category ? category.emoji : "❓",
            categoryColor: category ? category.color : "#DED8E3",
          };
        });

        setTransactions(transactionsWithCategory);

        const categoryTotals = categories.map((category) => {
          const total = transactionsWithCategory
            .filter((transaction) => transaction.category === category.id)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
          return {
            name: category.name,
            value: total,
            color: category.color || generateRandomColor(),
          };
        });

        setPieData(categoryTotals.filter((item) => item.value > 0));
      }
      setLoading(false);
    };
    fetchData();
  }, [id, selectedDateRange]); // Add selectedDateRange as a dependency


  // Helper function to generate a random color (optional)
  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const handleDateChange = (newRange: { startDate: DateType; endDate: DateType }) => {
    if (newRange.startDate && newRange.endDate) {
      setSelectedDateRange(newRange);
      toggleDialog1(); // Close the dialog after selecting a valid range
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: item.categoryColor }]}>
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
     <BlankCard></BlankCard>
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
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {item.type === "renderCard" ? (
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
              ) : item.type === "graphSection" ? (
                <LinearGradient
                  colors={["#DED8E3", cardData.color || "#FFFFFF", "#A8DADC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardContainer}
                >
                  <View style={{ padding: 1, alignItems: "center" }}>
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
                        const roundedValue = Math.round(totalValue);
                        setRoundedValue(roundedValue);
                        return (
                          <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 22, color: "white", fontFamily: "Regular" }}>
                              {roundedValue}
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
              ) : (
                <LinearGradient
                  colors={["#DED8E3", cardData.color || "#FFFFFF", "#A8DADC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.cardContainer, { width: width - 20, marginHorizontal: 10 }]}
                >
                  <Text style={styles.detailText}>
                    Tarjeta de <Text style={{ fontFamily: "Medium" }}>{cardData.tipo}</Text>
                  </Text>
                  <Text style={styles.detailText}>
                    Uso total del periodo: <Text style={{ fontFamily: "Bold" }}>${roundedValue}</Text>
                  </Text>
                  <Text style={styles.detailText}>
                    Limite: <Text style={{ fontFamily: "Bold" }}>$11,580.00</Text>
                  </Text>
                  <Text style={styles.detailText}>
                    Pendiente por pagar: <Text style={{ fontFamily: "Bold" }}>${cardData.negative}</Text>
                  </Text>
                  <Text style={styles.detailText}>
                    Fecha de Corte: <Text style={{ fontFamily: "Bold" }}>20/Enero</Text>
                  </Text>
                </LinearGradient>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.periodSelector}>
        <Text style={styles.periodText}>
          {dayjs(selectedDateRange.startDate).format("DD MMM YYYY")} - {dayjs(selectedDateRange.endDate).format("DD MMM YYYY")}
        </Text>
        <TouchableOpacity onPress={toggleDialog1}>
          <Text style={styles.changePeriod}>Cambiar Periodo</Text>
        </TouchableOpacity>

        <Dialog
          isVisible={visible1}
          onBackdropPress={toggleDialog1}
          overlayStyle={{
            position: "absolute",
            width: "90%",
            borderRadius: 20,
          }}
        >
          <Dialog.Title title="Seleccionar Fecha" titleStyle={styles.periodText} />
          <CustomDatePicker
            date={selectedDateRange}
            onDateChange={handleDateChange}
            mode="range"
          />
        </Dialog>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionsList}
        ListHeaderComponent={<Text style={styles.listHeader}>Transacciones Recientes</Text>}
      />

      <SpeedDial
          isOpen={open}
          icon={{ name: 'add', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
          color={cardData.color}
          size="large"
        >
          <SpeedDial.Action
            icon={{ name: 'donate', color: '#fff', type: "font-awesome-5"}}
            title="Nueva Transaccion"
            onPress={() => console.log('Add Something')}
            color="#C0B3DE"
            size="large"
          />
          <SpeedDial.Action
            icon={{ name: 'cash-plus', color: '#fff', type: "material-community" }}
            title="Ingreso"
            onPress={() => console.log('Delete Something')}
            color="#C0B3DE"
            size="large"
          />
          <SpeedDial.Action
            icon={{ name: 'add', color: '#fff', }}
            title="Retiro"
            onPress={() => console.log('Delete wwd')}
            color="#C0B3DE"
            size="large"
          />
      </SpeedDial>


    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backcard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: "#E6E8FF",
    borderRadius: 40
  },
  header: {
    marginTop: 20,
    height: height * 0.34,
    marginBottom: 10,
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#E6E8FF",
    borderColor: "#DED8E3",
    borderWidth: 2
  },
  periodText: {
    fontSize: 16,
    fontFamily: "Medium",
  },
  changePeriod: {
    fontSize: 14,
    color: "#957FEF",
    fontFamily: "Medium",
  },
  detailText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Light",
    marginVertical: 2,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingBottom: 85,
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
    backgroundColor: "#FAFAFF",
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#DED8E3",
    borderWidth: 2
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
    color: "#CF2839",
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
    marginBottom: 15,
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
    marginBottom: 10,
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
