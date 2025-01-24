import React, { useState } from "react";
import { StyleSheet, Image, FlatList, TouchableOpacity, View, Dimensions } from "react-native";
import { Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, } from "react-native-reanimated";
import { ScrollView } from "react-native";
import Carousel from "react-native-reanimated-carousel";


export default function Credit() {
  const [selectedPeriod, setSelectedPeriod] = useState("Enero"); // Default to "January"
  const [expanded, setExpanded] = useState(false);
  const animationHeight = useSharedValue(0); // Shared value for height
  const [currentIndex, setCurrentIndex] = useState(0); // Track current swipe index

        {/* animation */}

      const toggleExpand = () => {
        setExpanded((prev) => !prev);
        animationHeight.value = expanded ? 0 : 100; // Change the height when toggling
      };
      const animatedStyle = useAnimatedStyle(() => {
        return {
          height: withTiming(animationHeight.value, { duration: 300 }), // Smooth transition
        };
      });

  const transactionData = [
    {
      id: "1",
      title: "Arbol De Navidad",
      type: "Mensual (1/3)",
      date: "13 Enero",
      time: "8:25 PM",
      amount: "-$4,000.00",
    },
    {
      id: "2",
      title: "Regalos Liverpool",
      type: "Pago Unico",
      date: "16 Enero",
      time: "12:56 PM",
      amount: "-$1,200.00",
    },
    {
      id: "3",
      title: "Medicina Farmacia Guadalajara",
      type: "Pago Unico",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },
    {
      id: "4",
      title: "Tennis",
      type: "Pago Unico",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },
    {
      id: "5",
      title: "Medicina Farmacia Guadalajara",
      type: "Pago Unico",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },
    {
      id: "6",
      title: "Medicina Farmacia Guadalajara",
      type: "Pago Unico",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },

  ];

   const renderCard = (item) => (
    <View style={styles.cardContainer}>
      {/* Top Section */}
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.totalBalanceText}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{item.totalBalance}</Text>
        </View>
        <View>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </View>

      {/* Card Number Section */}
      <View style={styles.cardNumberSection}>
        <Text style={styles.cardNumber}>{item.cardNumber}</Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardNameLabel}>Name</Text>
          <Text style={styles.cardName}>{item.name}</Text>
        </View>
        <View>
          <Text style={styles.cardExpLabel}>Exp</Text>
          <Text style={styles.cardExpDate}>{item.expiry}</Text>
        </View>
      </View>
    </View>
  );


  const pieData = [
    {
      value: 47,
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      focused: true,
    },
    { value: 40, color: "#93FCF8", gradientCenterColor: "#3BE9DE" },
    { value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
    { value: 3, color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
  ];

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionSubtitle}>
        {item.type}
        </Text>
        <Text style={styles.transactionSubtitle}>
           {item.date} | {item.time}
        </Text>
      </View>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>


      <ScrollView
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  onMomentumScrollEnd={(event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }}
>
        {/* Graph Section */}
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.graphcard, { width: width - 20, marginHorizontal: 10 }]}
        >
          <Text style={{ fontSize: 16, color: "white", fontFamily: "Bold" }}>
            Citibanamex Clasica
          </Text>
          <View style={{ padding: 5, alignItems: "center" }}>
            <PieChart
              data={pieData}
              donut
              showGradient
              sectionAutoFocus
              radius={80}
              innerRadius={50}
              innerCircleColor={"#232B5D"}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 22, color: "white", fontFamily: "Regular" }}>
                      47%
                    </Text>
                    <Text style={{ fontSize: 12, color: "white", fontFamily: "Regular" }}>
                      Excelente
                    </Text>
                  </View>
                );
              }}
            />
          </View>

        {/* Expandable Section */}
        <TouchableOpacity
            style={styles.chevronButton}
            onPress={toggleExpand}
          >
            <Text style={styles.chevron}>{expanded ? " ▲ " : " ▼ "}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.expandableContainer, animatedStyle]}>
            <Text style={styles.detailText}>
              Uso Total: <Text style={{ fontFamily: "Bold" }}>$2,500.00</Text>
            </Text>
            <Text style={styles.detailText}>
              Limite: <Text style={{ fontFamily: "Bold" }}>$11,580.00</Text>
            </Text>
            <Text style={styles.detailText}>
              Pendiente por pagar: <Text style={{ fontFamily: "Bold" }}>$4,580.00</Text>
            </Text>
            <Text style={styles.detailText}>
              Fecha de Corte: <Text style={{ fontFamily: "Bold" }}>20/Enero</Text>
            </Text>
          </Animated.View>
        </LinearGradient>

{/* Swipeable Card */}
<View style={styles.cardContainer}>
  {/* Top Section */}
  <View style={styles.cardTop}>
    <View>
      <Text style={styles.totalBalanceText}>Total Balance</Text>
      <Text style={styles.balanceAmount}>$10,000.00</Text>
    </View>
    <View>
      <Text style={styles.logoText}>LOGO</Text>
    </View>
  </View>

  {/* Card Number Section */}
  <View style={styles.cardNumberSection}>
    <Text style={styles.cardNumber}>1234</Text>
    <Text style={styles.cardNumber}>••••</Text>
    <Text style={styles.cardNumber}>••••</Text>
    <Text style={styles.cardNumber}>3456</Text>
  </View>

  {/* Bottom Section */}
  <View style={styles.cardBottom}>
    <View>
      <Text style={styles.cardNameLabel}>Name</Text>
      <Text style={styles.cardName}>Zarror Nibros</Text>
    </View>
    <View>
      <Text style={styles.cardExpLabel}>Exp</Text>
      <Text style={styles.cardExpDate}>09/23</Text>
    </View>
  </View>
</View>


</ScrollView>


      </View>

              {/* Period Selector */}
              <View style={styles.periodSelector}>
                <Text style={styles.periodText}>{selectedPeriod}</Text>
                <TouchableOpacity onPress={() => alert("Open Period Selector")}>
                  <Text style={styles.changePeriod}>Cambiar Periodo</Text>
                </TouchableOpacity>
              </View>

      {/* Transactions List */}
      <FlatList
        data={transactionData}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
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
    backgroundColor: "#fff",
  },
  backcard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: "#EDD2FC",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 16,
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
    color: "#007AFF",
    fontFamily: "Medium",
  },
  graphcard: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#232B5D",
  },
  chevronButton: {
    alignSelf: "center",
    marginTop: 10,
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
    backgroundColor: "#E6E6E6",
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
    backgroundColor: "#6DB6FE",
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
    backgroundColor: "#fff",
    borderRadius: 10,
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
    fontSize: 14,
    color: "#888",
    fontFamily: "Regular", // Adjust based on your fonts
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardNumberSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardNameLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardExpLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginBottom: 5,
  },
  cardExpDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
});
