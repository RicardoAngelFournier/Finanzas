import React, { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 as FontAwesome6 } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/database/supabaseClient";

export default function NewCard() {
  const router = useRouter();

  const [cardDetails, setCardDetails] = useState({
    bank: "",
    name: "",
    ending: "",
    expiration: "",
    color: "#A8DADC",
    type: "debit",
    issuer: "visa",
  });

  const [cards, setCards] = useState<
    { id: number; name: string; bank: string; ending: string; expiration: string }[]
  >([]);


  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to ${value}`);
    setCardDetails({ ...cardDetails, [field]: value });
  };

  const colors = ["#3B82F6", "#9333EA", "#FAE1FA", "#544CCA", "#00D09E", "#F43F5E", "#F1FE87"];
  const [selectedType, setSelectedType] = useState();

  const issuers = [
    { name: "visa", icon: "cc-visa" },
    { name: "mastercard", icon: "cc-mastercard" },
    { name: "amex", icon: "cc-amex" },
    { name: "paypal", icon: "paypal" },
    { name: "other", icon: "wallet" },
  ];

          const handleSave = async () => {
            const { bank, name, ending, expiration, color, type, issuer } = cardDetails;
          
            // Check if fields are filled
            if ([bank, name, ending, expiration].some((field) => !field.trim())) {
              Alert.alert('Error', 'Please fill in all fields.');
              return;
            }
          
            // Format expiration date from MM/YY to YYYY-MM-DD
            const expirationDate = formatExpirationDate(expiration);
          
            if (!expirationDate) {
              Alert.alert('Error', 'Invalid expiration date format.');
              return;
            }
          
            // Map card type string to integer value
            const typeMap = {
              debit: 1,   // example mapping
              credit: 2,
              wallet: 3,
              other: 4,
            };
          
            const cardType = typeMap[type];  // Convert string to integer
          
            if (!cardType) {
              Alert.alert('Error', 'Invalid card type.');
              return;
            }
          
            try {
              const { error } = await supabase.from('cards').insert([
                {
                  bank: bank.trim(),
                  name: name.trim(),
                  ending: ending.trim(),
                  expiration: expirationDate,
                  color,
                  type: cardType,  // Send the integer type
                  issuer,
                  balance: '0',
                  negative: '0',
                },
              ]);
          
              if (error) {
                console.error('Error saving card:', error);
                Alert.alert('Error', 'Something went wrong while saving the card.');
              } else {
                Alert.alert('Success', 'Card saved successfully!');
                router.back();
              }
            } catch (error) {
              console.error('Unexpected error saving card:', error);
              Alert.alert('Error', 'Unexpected error occurred.');
            }
          };
          

  // Function to convert MM/YY format to YYYY-MM-DD format
const formatExpirationDate = (expiration: string) => {
  const [month, year] = expiration.split('/');

  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return null; // Invalid date format
  }

  const fullYear = `20${year}`; // Convert YY to YYYY
  const formattedDate = `${fullYear}-${month.padStart(2, '0')}-01`; // Set day as '01'

  return formattedDate;
};

const handleExpirationChange = (value) => {
  // Remove any non-numeric characters
  const cleanedValue = value.replace(/\D/g, '');
  let formattedValue = cleanedValue;
  if (cleanedValue.length > 2) {
    formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
  }
  // Update the cardDetails with the formatted expiration date
  handleInputChange('expiration', formattedValue);
};

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backcard} />

      <LinearGradient
        colors={["#DED8E3", "#F4989C", cardDetails.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPreview}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardText}>{cardDetails.bank || "Bank Name"}</Text>
            <Text style={styles.balanceText}>$0.00</Text>
          </View>
          <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="white" />
        </View>
        <View style={styles.cardNumber}>
          <Text style={styles.cardText}>{cardDetails.ending || "1234"}</Text>
          <Text style={styles.cardText}>••••</Text>
          <Text style={styles.cardText}>••••</Text>
          <Text style={styles.cardText}>3456</Text>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.smallText}>Name</Text>
            <Text style={styles.cardText}>{cardDetails.name || "Cardholder"}</Text>
          </View>
          <View>
            <Text style={styles.smallText}>Exp</Text>
            <Text style={styles.cardText}>{cardDetails.expiration || "MM/YY"}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color, borderWidth: cardDetails.color === color ? 3 : 0 , borderColor: "#fff" }]}
              onPress={() => handleInputChange("color", color)}
            />
          ))}
        </View>

        <View style={{borderRadius: 10, borderWidth: 1,  overflow: 'hidden', }}>
        <Picker
            style={styles.picker}
            selectedValue={selectedType}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedType(itemValue)
            }>
            <Picker.Item label="Tarjeta de Debito" value="debit" />
            <Picker.Item label="Tarjeta de Credito" value="credit" />
            <Picker.Item label="Efectivo" value="wallet" />
            <Picker.Item label="Otro" value="wallet" />
        </Picker>
        </View>
        <TextInput
          placeholder="Nombre  de la Tarjeta"
          placeholderTextColor="#fff"
          style={styles.input}
          onChangeText={(text) => handleInputChange("name", text)}
        />
        <TextInput
          placeholder="Banco"
          placeholderTextColor="#fff"
          style={styles.input}
          onChangeText={(text) => handleInputChange("bank", text)}
        />
        <View style={styles.row}>
        <TextInput
          placeholder="Card Ending"
          placeholderTextColor="#fff"
          value={cardDetails.ending}
          style={styles.input}
          onChangeText={(value) => handleInputChange("ending", value)}
          />
          <TextInput
          placeholder="Expiration Date (MM/YY)"
          placeholderTextColor="#fff"
          value={cardDetails.expiration}
          style={styles.input}
          onChangeText={handleExpirationChange}
          />
        </View>

        <Text style={styles.label}>Issuer</Text>
        <View style={styles.issuerContainer}>
          {issuers.map(({ name, icon }) => (
            <TouchableOpacity
              key={name}
              style={[
                styles.issuerButton,
                { backgroundColor: cardDetails.issuer === name ? "#4F46E5" : "#1E293B" },
              ]}
              onPress={() => handleInputChange("issuer", name)}
            >
              <FontAwesome6 name={icon} size={24} color="white" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0C051D",
    paddingBottom: 20,
  },
  backcard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: "#1E1E2F",
    borderRadius: 40
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  cardPreview: {
    marginTop: 40,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: width - 20,
    alignSelf: "center",
    fontFamily: "Regular"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    fontFamily: "Regular",
    color: "#FFF",
  },
  balanceText: {
    fontSize: 24,
    fontFamily: "Bold",
    color: "#FFF",
  },
  cardNumber: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallText: {
    fontSize: 12,
    color: "#FFF",
  },
  form: {
    padding: 20,
  },
  label: {
    color: "#FFF",
    marginBottom: 10,
    fontFamily: "Medium",
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#374760",
    borderRadius: 25,
    color: "#FFF",
    marginBottom: 10,
    fontFamily: "Medium",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#374760",
    borderRadius: 25,
    padding: 10,
    color: "#FFF",
    marginBottom: 15,
    fontFamily: "Light",
    paddingHorizontal: 20,
  },
  colorPicker: {
    flexDirection: "row",
    marginBottom: 20,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  issuerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  issuerButton: {
    padding: 15,
    borderRadius: 25,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Bold"

  },
  cancelButton: {
    backgroundColor: "#E11D48",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Light"
  },
});
