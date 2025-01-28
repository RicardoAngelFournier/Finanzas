import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FlatList } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function Score() {
    const progress = useRef(new Animated.Value(0)).current; // Animated value for the progress bar
    const currentScore = 0.8; // Example variable that determines the progress
    const [selectedPeriod, setSelectedPeriod] = useState("Enero"); // Default to "January"
    
    const scores = [
        {
          id: "1",
          type: "BBB",
          date: "13 Enero",
          time: "8:25 PM",
          savings: "$15,000.00",
        },
        {
          id: "2",
          type: "A+",
          date: "16 Enero",
          time: "12:56 PM",
          amount: "-$15,200.00",
        },
        {
            id: "3",
            type: "A+",
            date: "16 Enero",
            time: "12:56 PM",
            amount: "-$15,200.00",
          },
    
      ];

    useEffect(() => {
        // Calculate width percentage based on the score
        const progressWidth = currentScore * 100; // Assuming 1 is the max score
        Animated.timing(progress, {
            toValue: progressWidth, // Target width as a percentage
            duration: 1000, // Animation duration in ms
            useNativeDriver: false, // For width animation
        }).start();
    }, [currentScore]);

    // Interpolate the Animated.Value to create a percentage width
    const widthInterpolation = progress.interpolate({
        inputRange: [0, 100], // Input values (progress in percentage)
        outputRange: ["0%", "100%"], // Corresponding width values
    });

      const renderscores = ({ item }) => (
        <View style={styles.transactionCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.transactionTitle}>{item.type}</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.date}</Text>
            <Text style={styles.transactionSubtitle}>
            {item.time}
            </Text>
          </View>
          <Text style={styles.transactionAmount}>{item.amount}</Text>
        </View>
      );

    return (
        <View style={styles.container}>
            {/* Background Card */}
            <View style={styles.backcard} />

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.subtitle}>Current Score:</Text>
                <View style={styles.row2}>
                    <Text style={{ fontFamily: "Bold", fontSize: 36 }}>0.5</Text>
                    <Text style={{ fontFamily: "Black", fontSize: 36 }}>BBB</Text>
                </View>
                <View style={styles.row2}>
                    <Text style={styles.subtitle}>Siguiente registro en: 3 dias 15 horas 26 minutos</Text>
                </View>
            </View>

            {/* Expense Section */}
            <View style={styles.expenseSection}>
                <View style={styles.row2}>
                    <Text style={styles.subtitle}>Score anterior: 0.688</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            { width: widthInterpolation }, // Animated width
                        ]}
                    />
                </View>

                {/* Labels under the Progress Bar */}
                <View style={styles.labelsContainer}>
                    <Text style={styles.label}>C−</Text>
                    <Text style={styles.label}>B</Text>
                    <Text style={styles.label2}>BB</Text>
                    <Text style={styles.label}>A-</Text>
                    <Text style={styles.label2}>A+</Text>
                    <Text style={styles.label}>AAA</Text>
                </View>
            </View>

            <View style={styles.scores}>
                <View style={styles.row}>
                    <LinearGradient
                        colors={['#8080ff', '#21CBF3']}
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

        {/* Period Selector */}
        <View style={styles.periodSelector}>
        <Text style={styles.periodText}>{selectedPeriod}</Text>
        <TouchableOpacity onPress={() => alert("Open Period Selector")}>
            <Text style={styles.changePeriod}>Cambiar Periodo</Text>
        </TouchableOpacity>
        </View>

      {/* Transactions List */}
      <FlatList
        data={scores}
        renderItem={renderscores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionsList}
        ListHeaderComponent={<Text style={styles.listHeader}>Scores Recientes</Text>}
      />

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
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
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
        marginBottom: 20,
        backgroundColor: "#FAE1FA",
        borderRadius: 28,
        padding: 8,
    },
    progressBarContainer: {
        height: 18,
        backgroundColor: "#F1FFF3",
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 13,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#6C63FF", // Change color as needed
        borderRadius: 10,
    },
    labelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    label: {
        fontSize: 11,
        color: "#000",
        fontFamily: "Regular",
    },
    label2: {
        fontSize: 12,
        color: "#000",
        fontFamily: "Light",
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
      transactionsList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
});
