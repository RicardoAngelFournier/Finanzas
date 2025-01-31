import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { Avatar } from "@rneui/themed";

export default function User() {
  return (
        <View style={styles.container}>
                <View style={styles.backcard}/>

      {/* Profile Section */}
      <View style={styles.header}>
          <View style={styles.row3}>
            <Text style={{ fontFamily: 'Medium', fontSize: 20, color: "#DAC4F7"}} >ENERO 2025</Text>
              <Avatar
                  size={32}
                  rounded
                  title="RA"
                  containerStyle={{ backgroundColor: "#DAC4F7" }}
                />
          </View>
          <Text style={styles.subtitle}>Buenos días Ricardo</Text>
      </View>
      
      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$450.54</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="wallet" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="send" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cash" size={24} color="#0C051D" />
          <Text style={styles.actionText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time" size={24} color="#0C051D" />
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  backcard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: '#0C051D',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    marginTop: 40,
    color: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#D6F6DD',
    fontFamily: "Medium", 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  row3: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DED8E3",
  },
  balanceContainer: {
    backgroundColor: "#DED8E3",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#625967",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0C051D",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#DAC4F7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  actionText: {
    fontSize: 12,
    marginTop: 5,
    color: "#0C051D",
  },
});
