import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LineChart } from "react-native-gifted-charts"


export default function Score() {
  const progress = useRef(new Animated.Value(0)).current; // Animated value for the progress bar
  const currentScore = 0.688; // Example variable that determines the progress

  const data1 = [
    {value: 70},
    {value: 36},
    {value: 50},
    {value: 40},
    {value: 18},
    {value: 38},
  ];
  const data2 = [
    {value: 50},
    {value: 10},
    {value: 45},
    {value: 30},
    {value: 45},
    {value: 18},
  ];
  

  useEffect(() => {
    // Calculate width percentage based on the score
    const progressWidth = (currentScore / 1) * 100; // Assuming 1 is the max score
    // Animate the progress bar width
    Animated.timing(progress, {
      toValue: progressWidth, // Target width as percentage
      duration: 1000, // Animation duration in ms
      useNativeDriver: false, // For width animation
    }).start();
  }, [currentScore]);

  return (
    <View style={styles.container}>
      {/* Background Card */}
      <View style={styles.backcard} />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>Current Score:</Text>
        <View style={styles.row2}>
          <Text style={{ fontFamily: "ExtraBold", fontSize: 36 }}>0.688</Text>
          <Text style={{ fontFamily: "ExtraBold", fontSize: 36 }}>BBB</Text>
        </View>
      </View>

      {/* Expense Section */}
      <View style={styles.expenseSection}>
          <View
              style={{
                paddingVertical: 0,
              }}>
              <LineChart
                areaChart
                curved
                data={data1}
                data2={data2}
                hideDataPoints
                spacing={68}
                color1="#8a56ce"
                color2="#56acce"
                startFillColor1="#8a56ce"
                startFillColor2="#56acce"
                endFillColor1="#8a56ce"
                endFillColor2="#56acce"
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={0}
                noOfSections={4}
                yAxisColor="white"
                yAxisThickness={0}
                rulesType="solid"
                rulesColor="gray"
                yAxisTextStyle={{color: 'gray'}}
                yAxisLabelSuffix="%"
                xAxisColor="lightgray"
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
                          backgroundColor: '#282C3E',
                          borderRadius: 4,
                          justifyContent:'center',
                          paddingLeft:16,
                        }}>
                        <Text style={{color: 'lightgray',fontSize:12}}>{2018}</Text>
                        <Text style={{color: 'white', fontWeight:'bold'}}>{items[0].value}</Text>
                        <Text style={{color: 'lightgray',fontSize:12,marginTop:12}}>{2019}</Text>
                        <Text style={{color: 'white', fontWeight:'bold'}}>{items[1].value}</Text>
                      </View>
                    );
                  },
                }}
              />
            </View>  
      </View>

        <View style={styles.scores}>
                <View style={styles.row}>
                    <LinearGradient
                        colors={['#EFD9CE', '#21CBF3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardItem}
                    >
                        <FontAwesome6 name="money-bill-wave" size={30} color="black" />
                        <Text style={styles.cardType}>Spare</Text>
                        <Text style={styles.cardBalance}>0.81</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#8080ff', '#21CBF3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardItem}
                    >
                        <FontAwesome6 name="credit-card" size={30} color="black" />
                        <Text style={styles.cardType}>Deuda</Text>
                        <Text style={styles.cardBalance}>0.81</Text>
                    </LinearGradient>
                </View>

                <View style={styles.row}>
                    <LinearGradient
                        colors={['#8080ff', '#21CBF3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardItem}
                    >
                        <FontAwesome6 name="circle-dollar-to-slot" size={30} color="black" />
                        <Text style={styles.cardType}>Ahorro</Text>
                        <Text style={styles.cardBalance}>0.81</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#8080ff', '#21CBF3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardItem}
                    >
                        <FontAwesome6 name="sack-dollar" size={30} color="black" />
                        <Text style={styles.cardType}>Ahorro</Text>
                        <Text style={styles.cardBalance}>0.81</Text>
                    </LinearGradient>
                </View>

            </View>

       
      </View>
  );
}

// Hide the header for this screen
export const screenOptions = {
  headerShown: false,
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FAEE",
    paddingHorizontal: 16,
  },
  backcard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: "#C0B3DE",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    height:50,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#0C3B35",
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
  expenseSection: {
    marginBottom: 25,
    
  },
  expenseText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: "#EFD9CE",
  },
  debtText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: "#EFD9CE",
  },
  divider: {
    width: 2,
    height: "90%",
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  progressBarContainer: {
    height: 14,
    backgroundColor: "#F1FFF3",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Medium",
  },
  scores: {
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 15,
},
cardItem: {
  height: 110,
  borderRadius: 16,
  padding: 12,
  justifyContent: 'space-between',
  width: 140,
  margin: 5
},
cardType: {
  fontSize: 16,
  fontFamily: "Regular",
  color: '#333',
},
cardBalance: {
  fontSize: 21,
  fontFamily: "Light",
  color: '#000',
},
cardAccount: {
  fontSize: 12,
  fontFamily: "Light",
  color: '#000',
},
});
