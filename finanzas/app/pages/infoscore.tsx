import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { Text } from "react-native";

const financialRatings = [
  { rating: "AAA", range: "0.95 - 1.00", color: ["#00D09E", "#fff"], description: "Exceptional score, extremely rare. Continue saving and investing." },
  { rating: "AA", range: "0.90 - 0.95", color: ["#33D8A5", "#fff"], description: "Excellent score. Keep up excellent management. No changes needed." },
  { rating: "A+", range: "0.85 - 0.90", color: ["#66E0AC", "#fff"], description: "Very strong score. Continue monitoring expenses and maintaining savings rate." },
  { rating: "A", range: "0.75 - 0.85", color: ["#99E9B3", "#fff"], description: "Good score. Stay consistent with your financial discipline." },
  { rating: "A-", range: "0.70 - 0.75", color: ["#D6F6DD", "#fff"], description: "Slightly above average. Consider reviewing expenses for possible reductions." },
  { rating: "BBB", range: "0.65 - 0.70", color: ["#FFFEB3", "#fff"], description: "Moderate score, average. Review budget allocations and prioritize debt payments." },
  { rating: "BB", range: "0.60 - 0.65", color: ["#FFE680", "#fff"], description: "Below average. Exercise caution. Begin tightening your budget." },
  { rating: "B+", range: "0.55 - 0.60", color: ["#FFB347", "#fff"], description: "Weak. Avoid new debt and reduce discretionary spending." },
  { rating: "B", range: "0.50 - 0.55", color: ["#FF8C33", "#fff"], description: "Very weak. Be very cautious. Minimize expenses and stop taking on debt." },
  { rating: "B-", range: "0.40 - 0.50", color: ["#FF5E33", "#fff"], description: "Poor. Limit spending to essentials only. Pay off high-interest debts." },
  { rating: "CCC", range: "0.35 - 0.40", color: ["#F4989C", "#fff"], description: "Very poor. Stop using credit cards entirely. Focus all efforts on paying off debt." },
  { rating: "CC", range: "0.30 - 0.35", color: ["#F47D81", "#fff"], description: "Critical. Immediate action required. Cease all discretionary spending." },
  { rating: "C+", range: "0.25 - 0.30", color: ["#F46064", "#fff"], description: "Severely poor. Stop all unnecessary expenditures and restructure finances." },
  { rating: "C", range: "0.15 - 0.25", color: ["#F44347", "#fff"], description: "Extreme risk. Take drastic measures: cancel credit cards, stop subscriptions." },
  { rating: "C-", range: "0.10 - 0.15", color: ["#D43336", "#fff"], description: "Near default. Critical financial emergency. Seek professional help if needed." },
  { rating: "D", range: "0.00 - 0.10", color: ["#808080", "#fff"], description: "Default. Absolute financial emergency. Seek urgent financial counseling." },
];

const currentScore = "A"; // Set the user's current score

export default function Infoscore() {
  return (
    <View style={styles.container}>
        <View style={styles.backcard}>
        <Text style={styles.score}>Tu score: {currentScore}</Text>
        </View>

      <FlatList
        data={financialRatings}
        keyExtractor={(item) => item.rating}
        renderItem={({ item }) => (
          <ListItem
            containerStyle={[
              styles.listItem,
              item.rating === currentScore ? styles.highlighted : {},
            ]}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: item.color,
              start: { x: 1, y: 0 },
              end: { x: 0, y: 1 },
            }}
          >
            <Avatar
              title={item.rating}
              rounded
              containerStyle={styles.avatar}
              titleStyle={{ fontWeight: "bold", color: "white" }}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.title}>
                {item.rating} ({item.range})
              </ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>
                {item.description}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DED8E3",
    paddingHorizontal: 16,
  },
  backcard: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
    backgroundColor: "#9987A9",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
},
  listItem: {
    marginVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  highlighted: {
    borderWidth: 4,
    borderStyle: "dashed",
    borderColor: "#000", // Gold highlight for current score
  },
  avatar: {
    backgroundColor: "#673AB7",
    width: 50,
    height: 50,
  },
  score: {
    top: 50,
    left: 25,
    fontSize: 30,
    color: "#fff",
    fontFamily: "Bold",
},
  title: {
    fontSize: 16,
    fontFamily: "Bold",
    color: "#0C051D",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Regular",
    color: "#26122F",
  },
});
