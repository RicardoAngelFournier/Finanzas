import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FlatList } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function Score() {
    const progress = useRef(new Animated.Value(0)).current; // Animated value for the progress bar
    const currentScore = 0.8; // Example variable that determines the progress
    const [selectedPeriod, setSelectedPeriod] = useState("Enero"); // Default to "January"
    const router = useRouter();

    const scores = [
        {
            id: "1",
            type: "BBB",
            date: "13 Enero",
            time: "8:25 PM",
            result: "Degradado ",
        },
        {
            id: "2",
            type: "A+",
            date: "16 Enero",
            time: "12:56 PM",
            result: "Afirmado",
        },
        {
            id: "3",
            type: "A+",
            date: "16 Enero",
            time: "12:56 PM",
            result: "Mejorado",
        },
        {
            id: "4",
            type: "A",
            date: "16 Enero",
            time: "12:56 PM",
            result: "Afirmado",
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
                <Text style={styles.transactionDetails}>{item.date}</Text>
                <Text style={styles.transactionSubtitle}>
                    {item.time}
                </Text>
            </View>
            <Text style={styles.transactionAmount}>{item.result}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Background Card */}
            <View style={styles.backcard} />

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.subtitle}>Score Actual:</Text>
                <View style={styles.row2}>
                    <Text style={{ fontFamily: "Bold", fontSize: 38, color: "#fff" }}>0.853</Text>
                    <Text style={{ fontFamily: "Black", fontSize: 38, color: "#fff" }}>BBB</Text>
                </View>
                <View style={styles.row2}>
                    <Text style={styles.subtitle2}>Siguiente registro en: 3 dias 15 horas 26 minutos</Text>
                </View>
            </View>


            <TouchableOpacity
                onPress={() => router.push("/pages/infoscore")} // Navigate to the "score" screen
            >
                {/* Expense Section */}
                <View style={styles.expenseSection}>
                    <View style={styles.row2}>

                        <Text style={styles.subtitle}>Score anterior: 0.688</Text>
                        <View style={{ marginRight: 10 }}>
                            <FontAwesome6 name="circle-chevron-right" size={24} color="white" />
                        </View>
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
            </TouchableOpacity>


            <View style={styles.scores}>
                <ScrollView horizontal>
                    <View style={styles.row}>
                        <LinearGradient
                            colors={['#DED8E3', '#9987A9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardItem}
                        >
                            <FontAwesome6 name="money-bill-wave" size={30} color="black" />
                            <Text style={styles.cardType}>Spare</Text>
                            <Text style={styles.cardBalance}>0.81</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#9987A9', '#DED8E3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardItem}
                        >
                            <FontAwesome6 name="credit-card" size={30} color="black" />
                            <Text style={styles.cardType}>Deuda</Text>
                            <Text style={styles.cardBalance}>0.81</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#DED8E3', '#9987A9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardItem}
                        >
                            <FontAwesome6 name="circle-dollar-to-slot" size={30} color="black" />
                            <Text style={styles.cardType}>Ahorro</Text>
                            <Text style={styles.cardBalance}>0.81</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#9987A9', '#DED8E3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardItem}
                        >
                            <FontAwesome6 name="sack-dollar" size={30} color="black" />
                            <Text style={styles.cardType}>Ahorro</Text>
                            <Text style={styles.cardBalance}>0.81</Text>
                        </LinearGradient>
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
        backgroundColor: "#DED8E3",
        paddingHorizontal: 16,
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
        marginTop: 40,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Regular",
    },
    subtitle2: {
        fontSize: 12,
        color: "#fff",
        fontFamily: "Light",
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
        backgroundColor: "#9987A9",
        borderRadius: 28,
        padding: 8,
    },
    progressBarContainer: {
        height: 18,
        backgroundColor: "#fff",
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
        marginHorizontal: 5,
    },
    label: {
        fontSize: 11,
        color: "#fff",
        fontFamily: "Bold",
    },
    label2: {
        fontSize: 12,
        color: "#fff",
        fontFamily: "Bold",
    },
    scores: {
        justifyContent: "space-around",
        marginTop: 15,
        marginBottom: 15,
    },
    cardItem: {
        height: 110,
        borderRadius: 16,
        padding: 12,
        justifyContent: 'space-between',
        width: 120,
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
        marginRight: 15,
    },
    iconBackground: {
        height: 40,
        width: 40,
        backgroundColor: "#6DB6FE",
        borderRadius: 20,
    },
    transactionDetails: {
        flex: 1,
        fontFamily: "Regular",
        fontSize: 14,
    },
    transactionTitle: {
        fontSize: 20,
        fontFamily: "Bold",
    },
    transactionSubtitle: {
        fontSize: 12,
        fontFamily: "Light",
        color: "#0C051D",
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
        color: "#957FEF",
        fontFamily: "Medium",
    },
    transactionsList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
