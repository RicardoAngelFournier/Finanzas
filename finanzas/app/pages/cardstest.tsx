import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "@/database/supabaseClient"; // Ensure you import your supabase client here

export default function TabHome() {
  
  const [cards, setCards] = useState<
    { id: number; name: string; bank: string; ending: string; expiration: string; color: string }[] 
  >([]);

  useFocusEffect(
    useCallback(() => {
      loadCards(); // Fetch data when the screen is focused
    }, [])
  );

  const headerRight = () => (
    <TouchableOpacity onPress={() => router.push("/")} style={{ marginRight: 10 }}>
      <FontAwesome name="plus-circle" size={28} color="blue" />
    </TouchableOpacity>
  );

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("id, name, bank, ending, expiration, color");

      if (error) {
        console.error("Error loading cards:", error);
      } else {
        setCards(data || []);
      }
    } catch (error) {
      console.error("Unexpected error loading cards:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerRight }} />
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.color || "#f1f1f1" }]}>
            <View style={styles.cardDetails}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.bank}</Text>
              <Text style={styles.cardInfo}>
                Ending: {item.ending} | Exp: {item.expiration}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/modal?id=${item.id}`)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#555",
  },
  cardInfo: {
    color: "#888",
  },
  editButton: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
