import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LineChart } from "react-native-gifted-charts";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Score() {
  const currentSavings = 16000;
  const [selectedMonth, setSelectedMonth] = useState(0);
  const tabTranslateX = useRef(new Animated.Value(0)).current;

  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"];
  const tabWidth = (width * 0.9) / months.length; // Ensure tab stays within bounds

  // Data Sets (Both always shown)
  const data1 = [
    { value: 15500 }, { value: 16600 }, { value: 17600 },
    { value: 16880 }, { value: 16660 }, { value: 17600 }, { value: 18600 } , { value: 18600 }
  ];
  const data2 = [
    { value: 14200 }, { value: 15200 }, { value: 16200 },
    { value: 17200 }, { value: 18200 }, { value: 19200 }, { value: 20200 } , { value: 18600 } , { value: 18600 }
  ];

  const savingData = [
    {
      id: "1",
      type: "Ingreso",
      date: "13 Enero",
      time: "8:25 PM",
      amount: "$4,000.00",
    },
    {
      id: "2",
      type: "Ingreso",
      date: "16 Enero",
      time: "12:56 PM",
      amount: "$1,200.00",
    },
    {
      id: "3",
      type: "Retiro",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },
    {
      id: "4",
      type: "Retiro",
      date: "18 Enero",
      time: "11:56 AM",
      amount: "-$300.00",
    },
  ];

  // Handle Tab Change Animation
  const handleTabPress = (index) => {
    setSelectedMonth(index);
    Animated.spring(tabTranslateX, {
      toValue: tabWidth * index, // Adjusted to keep within bounds
      useNativeDriver: true,
    }).start();
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
              $ {currentSavings} MXN 
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Graph */}
      <View style={{ marginTop: 15 }}>
        <LineChart
          yAxisOffset={13000}
          maxValue={7000}
          height={height * 0.25}
          width={width}
          areaChart
          isAnimated
          animateOnDataChange
          curved
          data={data1} // Always show both datasets
          data2={data2}
          spacing={60}
          color1="#B78AFF"
          color2="#A8DADC"
          startFillColor1="#B78AFF"
          startFillColor2="#A8DADC"
          endFillColor1="#B78AFF"
          endFillColor2="#A8DADC"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={5}
          yAxisColor="white"
          yAxisThickness={0}
          hideYAxisText
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: 'lightgray',
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: items => {
              return (
                <View
                  style={{
                    height: 120,
                    width: 100,
                    backgroundColor: '#0C051D',
                    borderRadius: 4,
                    justifyContent:'center',
                    paddingLeft:16,
                  }}>
                  <Text style={{color: 'lightgray',fontSize:12}}>Actual</Text>
                  <Text style={{color: 'white', fontWeight:'bold'}}>{items[0].value}</Text>
                  <Text style={{color: 'lightgray',fontSize:12,marginTop:12}}>Target 40%</Text>
                  <Text style={{color: 'white', fontWeight:'bold'}}>{items[1].value}</Text>
                </View>
              );
            },
          }}
        />
      </View>

      {/* Capsule Tab Bar */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <Animated.View style={[styles.tabIndicator, { width: tabWidth - 10, transform: [{ translateX: tabTranslateX }] }]} />
          {months.map((month, index) => (
            <Pressable key={index} style={styles.tabButton} onPress={() => handleTabPress(index)}>
              <Text style={[styles.tabText, selectedMonth === index && { color: "black" }]}>{month}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Other Components */}
      <View style={styles.scores}>
      <ScrollView horizontal>
        <View style={styles.row2}>
          
          <LinearGradient colors={["#9987A9", "#DED8E3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>Aumento este mes</Text>
            <Text style={styles.cardBalance}>$ 1280</Text>
          </LinearGradient>

          <LinearGradient colors={["#9987A9", "#DED8E3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>% De sueldo ahorrado</Text>
            <Text style={styles.cardBalance}>41.5</Text>
          </LinearGradient>

          <LinearGradient colors={["#9987A9", "#DED8E3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
            <Text style={styles.cardType}>Retiros este mes</Text>
            <Text style={styles.cardBalance}>$ 880</Text>
          </LinearGradient>

          
          <LinearGradient colors={["#9987A9", "#DED8E3"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardItem}>
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
                data={savingData}
                renderItem={renderSavings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.transactionsList}
                ListHeaderComponent={<Text style={styles.listHeader}>Transacciones este mes</Text>}
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
    height:50,
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
  margin: 2
},
cardType: {
  fontSize: 14,
  fontFamily: "Regular",
  color: '#333',
},
cardBalance: {
  fontSize: 19,
  fontFamily: "Medium",
  color: '#000',
},
tabBarContainer: { alignItems: "center" },
tabBar: { flexDirection: "row", backgroundColor: "#232B5D", borderRadius: 30, padding: 5, width: width * 0.9, alignItems: "center", justifyContent: "space-between", position: "relative" },
tabIndicator: { position: "absolute", backgroundColor: "white", width: (width * 0.9) / 7 - 10, height: "85%", borderRadius: 25, left: 5 },
tabButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
tabText: { fontSize: 14, fontWeight: "bold", color: "#A8DADC" },
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
  fontSize: 16,
  fontFamily: "Bold",
  color: "black",
},
});
