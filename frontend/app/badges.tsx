import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = "http://192.168.1.157:8000";

type Badge = {
  badge_id: number;
  badge_name: string;
  badge_descrip: string;
  badge_icon: string;
  earned: number;
};

export const unstable_settings = {
  tabBarButton: () => null,
};

export default function Badges() {
  const { userId } = useLocalSearchParams();

  const userIdNum = Array.isArray(userId)
    ? Number(userId[0])
    : Number(userId);

  const isValidUserId = !isNaN(userIdNum) && userIdNum > 0;

  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (!isValidUserId) {
      console.log("Invalid userId:", userId);
      return;
    }

    fetch(`${API_URL}/get_badges.php?user_id=${userIdNum}`)
      .then(res => res.json())
      .then(data => {
        console.log("BADGE DATA:", data);

        if (data.status === "success") {
          setBadges(data.badges);
        }
      })
      .catch(err => console.log("Badge fetch error:", err));
  }, [userIdNum]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.creamContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back-outline" size={33} color="#264e36" />
          </TouchableOpacity>

          <Text style={styles.title}>Eco Badges</Text>

          {/* empty spacer so title stays centered */}
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={badges}
          keyExtractor={(item) => item.badge_id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.badgeCard}>
              <Text style={styles.badgeName}>
                {item.badge_name}
              </Text>

              <Text style={styles.badgeTxt}>
                {item.badge_descrip}
              </Text>

              <Text style={styles.badgeTxt}>
                {item.earned ? "Completed" : "Not Completed"}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#264e36",
  },
  creamContainer: {
    backgroundColor: "#F5F0E6",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 200,
  },

  title:{
    fontSize: 28,
    fontFamily: "Quicksand_700Bold",
    color: "#264e36",
    textAlign: "center",
  },

  badgeCard:{
    backgroundColor: "#5ca377",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  badgeName:{
    fontSize: 20,
    fontFamily: 'Quicksand_700Bold',
    color: "#F5F0E6",
  },

  badgeTxt: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: "#F5F0E6",
  },
  
  //back btn
  backBtn: {
    width: 40,
  },

  headerSpacer: {
    width: 40,
  },

  headerRow: {
    flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
  },
});