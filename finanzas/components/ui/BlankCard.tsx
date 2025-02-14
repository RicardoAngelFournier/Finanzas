// BlankCard.tsx
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Skeleton } from '@rneui/themed';

const BlankCard = () => {
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
};

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
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      },
      header: {
        marginTop: 20,
        height: height * 0.34,
        marginBottom: 10,
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
  transactionsList: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default BlankCard;
