import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, Animated, Dimensions, Pressable, FlatList, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/database/supabaseClient"; //query with this
import { useEffect } from "react";

export default function Score() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const tabTranslateX = useRef(new Animated.Value(0)).current;
  const [savingsData, setSavingsData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);
  const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);

  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => currentYear - i); // Only past and current years

  useEffect(() => {
    fetchSavingsData();
  }, []);

      const fetchSavingsData = async () => {
        setRefreshing(true);
        const { data, error } = await supabase
          .from("savings")
          .select("date, amount, total")
          .order("date", { ascending: true });
      
        if (error) {
          console.error(error);
        } else {
          const chartData = data.map((item) => ({
            value: item.total, // Using 'total' for the chart
            date: item.date
          }));
          
          console.log("data",data); 
          
          if (data.length > 0) {
            setSavingsData(data.reverse()); // Keep the FlatList in the original order
            setTransactions(data); // Keep the FlatList in the original order
            setTotalSavings(data.reverse()[data.length - 1].total); // Get the last total
            setWithdrawalsTotal(calculateWithdrawals(data)); // Store the total withdrawals in state
            
          }
        }
        setRefreshing(false);
      };

      const filteredData = savingsData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
      });
    
      useEffect(() => {
        if (filteredData.length > 0) {
          setTotalSavings(filteredData[filteredData.length - 1].total);
          setWithdrawalsTotal(filteredData.reduce((sum, item) => sum + (item.amount < 0 ? Math.abs(item.amount) : 0), 0));
        } else {
          setTotalSavings(0);
          setWithdrawalsTotal(0);
        }
      }, [selectedMonth, selectedYear, savingsData]);

    const chartData = savingsData.map((entry) => ({ value: entry.total}));

    const calculateWithdrawals = (data) => {
      return data
        .filter((item) => item.amount < 0)
        .reduce((sum, item) => sum + Math.abs(item.amount), 0); // Sum the absolute value of all negative amounts
    };
    

    // Handle Tab Change Animation
    const handleTabPress = (index) => {
      setSelectedMonth(index);
      Animated.spring(tabTranslateX, {
        toValue: tabWidth * index, // Adjusted to keep within bounds
        useNativeDriver: true,
      }).start();
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchSavingsData(); // Refresh the data
      setRefreshing(false);
    };

    const renderSavings = ({ item }) => (
      <View style={styles.transactionCard}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
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

      <TouchableOpacity onPress={() => console.log("Navigate to details")} activeOpacity={0.7}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Ahorro:</Text>
          <View style={styles.row2}>
            <Text style={{ fontFamily: "ExtraBold", fontSize: 38, color: "#ffffff" }}>
            $ {totalSavings} MXN
            </Text>

          </View>
        </View>
      </TouchableOpacity>

      {/* Graph */}
      <View style={{ marginTop: 15 }}>
        <LineChart
          yAxisOffset={1}
          height={height * 0.25}
          width={width}
          areaChart
          animateOnDataChange
          animationDuration={1000}
          animationEasing={20}
          curved
          data={chartData} 
          maxValue={totalSavings*1.2}
          spacing={60}
          color1="#B78AFF"
          color2="#A8DADC"
          startFillColor1="#B78AFF"
          startFillColor2="#A8DADC"
          endFillColor1="#B78AFF"
          endFillColor2="#A8DADC"
          startOpacity={0.9}
          endOpacity={0.1}
          initialSpacing={0}
          noOfSections={4}
          hideYAxisText
          dataPointsColor1="white"
          dataPointsRadius1={5}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'white',
            pointerStripWidth: 5,
            strokeDashArray: [2, 5],
            pointerColor: 'white',
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: items => (
              <View style={{ height: 90, width: 100, backgroundColor: '#0C051D', borderRadius: 4, justifyContent: 'center', paddingLeft: 16 }}>
                <Text style={{ color: 'lightgray', fontSize: 12 }}>Actual</Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0].total}</Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0].date}</Text>
              </View>
            ),
          }}
        />
      </View>

      {/* Capsule Tab Bar */}
      <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {months.map((month, index) => (
            <Pressable key={index} style={styles.tabButton} onPress={() => setSelectedMonth(index)}>
              <Text style={[styles.tabText, selectedMonth === index && { color: "#B78AFF" }]}>{month}</Text>
            </Pressable>
          ))}
        </ScrollView>
        </View>

        <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {years.map((year) => (
            <Pressable key={year} style={styles.tabButton} onPress={() => setSelectedYear(year)}>
              <Text style={[styles.tabText, selectedYear === year && { color: "#B78AFF" }]}>{year}</Text>
            </Pressable>
          ))}
        </ScrollView>
        </View>

      </View>


      {/* Other Components */}
      <View style={styles.scores}>
      <ScrollView horizontal>
        <View style={styles.row2}>
          
          <LinearGradient colors={["#9987A9", "#E6E8FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>Aumento este mes</Text>
            <Text style={styles.cardBalance}>$ 1280</Text>
          </LinearGradient>

          <LinearGradient colors={["#9987A9", "#E6E8FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>% De sueldo ahorrado</Text>
            <Text style={styles.cardBalance}>41.5</Text>
          </LinearGradient>

          <LinearGradient colors={["#9987A9", "#E6E8FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>Retiros este mes</Text>
            <Text style={styles.cardBalance}>$ {withdrawalsTotal}</Text>
          </LinearGradient>

          
          <LinearGradient colors={["#9987A9", "#E6E8FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>Retiros este mes</Text>
            <Text style={styles.cardBalance}>$ 880</Text>
          </LinearGradient>

          <TouchableOpacity style={styles.cardItem}>
            <Ionicons name="wallet" size={24} color="#0C051D" />
            <Text style={styles.cardType}>Top Up</Text>
          </TouchableOpacity>
          
        </View>
        </ScrollView>
      </View>

          <FlatList
      data={[...filteredData].reverse()} // Filter by selected month and show newest first
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<Text style={styles.listHeader}>Transacciones este mes</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={styles.transactionCard}>
          <Text style={styles.listHeader}>Ningun moviento</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.transactionCard}>
          <Text style={styles.transactionSubtitle}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text
            style={[
              styles.transactionAmount,
              { color: item.amount < 0 ? "red" : "green" }, // Red for withdrawals, green for deposits
            ]}
          >
            {item.amount < 0 ? `Withdrawal: -$${Math.abs(item.amount)}` : `Deposit: $${item.amount}`}
          </Text>
        </View>
      )}
      nestedScrollEnabled={true} // Allows scrolling inside another scrollable view
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
    height: height * 0.40,
    backgroundColor: "#0C051D",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    height:45,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Medium",
  },
  scores: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
},
cardItem: {
  height: 100,
  borderRadius: 16,
  padding: 15,
  justifyContent: 'center',
  alignItems: "center",
  width: 120,
  margin: 2,

},
cardType: {
  fontSize: 14,
  fontFamily: "Regular",
  color: '#333',
},
cardBalance: {
  fontSize: 19,
  fontFamily: "Bold",
  color: '#000',
},
tabBar: { flexDirection: "row", backgroundColor: "#232B5D", padding: 5, alignItems: "center", justifyContent: "space-between", position: "relative" },
tabIndicator: { position: "absolute", backgroundColor: "white", width: (width * 0.9) / 7 - 10, height: "85%", borderRadius: 25, left: 5 },
tabText: { fontSize: 14, color: "#A8DADC",  fontFamily: "Medium", },
tabBarContainer: { flexDirection: "column", alignItems: "center", },
tabButton: { padding: 10, marginHorizontal: 5, backgroundColor: "#232B5D", borderRadius: 5,   borderColor: "#fff", borderWidth: 1},
yearButton: { padding: 10, marginHorizontal: 5, backgroundColor: "#ddd", borderRadius: 5 },
yearText: { fontSize: 14 },
transactionsList: {
  paddingHorizontal: 16,
  paddingBottom: 16,
  flex: 1,
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
  justifyContent: "space-between",
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
  fontSize: 16,
  fontFamily: "Bold",
  color: "black",
},
});
