import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

let MapView: any = null;

if (Platform.OS !== "web") {
  MapView = require("react-native-maps").default;
}

export default function ShopScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("business");
  const [searchText, setSearchText] = useState("");
  const [ecoBusinesses, setEcoBusinesses] = useState<any[]>([]);

  const [mapRegion, setMapRegion] = useState({
    latitude: 28.5383,
    longitude: -81.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    fetch("http://localhost:8000/get_businesses.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setEcoBusinesses(data.businesses);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = async () => {
    if (!searchText) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`
      );

      const data = await response.json();

      if (data.length > 0) {
        setMapRegion({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.log("Location Not Found");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/ecomax_icon_dark.png')}
          style={styles.image}
        />

        <Pressable onPress={() => router.push("/search")}>
          <Ionicons name="search" size={24} color="#F5F0E6" />
        </Pressable>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab("business")}>
          <Text style={[styles.tabTxt, activeTab === "business" && styles.activeTab]}>
            Business
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("map")}>
          <Text style={[styles.tabTxt, activeTab === "map" && styles.activeTab]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* business tab */}
        {activeTab === "business" && (
          <>
            <Text style={styles.categoryLabel}>Featured</Text>

            <View style={styles.cardGrid}>
              {ecoBusinesses.map((item, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push(`/eco-shops/${item.id}`)}
                  >
                    <View style={styles.logoBox}>
                      <Image
                        source={{ uri: `http://localhost:8000/logos/${item.logo}` }}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.ptsRow}>
                      <Ionicons name="leaf" size={14} color="#1c4964" />
                      <Text style={styles.ptsTxt}>25</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.cardName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* map tab */}
        {activeTab === "map" && (
          <>
            <View style={styles.mapSearchBar}>
              <TextInput
                placeholder="Find Near Me"
                placeholderTextColor="white"
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
            </View>

            <View style={styles.mapPlaceholder}>
              <Pressable
                style={styles.mapWrapper}
                onPress={() => router.push("/full-map")}
              >
                {Platform.OS === "web" ? (
                  <iframe
                    title="EcoMax Map Preview"
                    src={`https://www.google.com/maps/embed/v1/view?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${mapRegion.latitude},${mapRegion.longitude}&zoom=12`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    loading="lazy"
                    allowFullScreen
                  />
                ) : (
                  <MapView style={styles.map} region={mapRegion} />
                )}
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  //body
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },

  //header
  header: {
    backgroundColor: "#264e36",
    paddingTop: 70,
    paddingBottom: 20,
    paddingLeft: 25,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
  },

  image: {
    height: 49,
    width: 37,
  },

  //tabs
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#F5F0E6",
  },

  tabTxt: {
    fontSize: 15,
    color: "#264e36",
    fontFamily: 'Quicksand_400Regular',
  },

  activeTab: {
    fontFamily: 'Quicksand_700Bold',
    borderBottomWidth: 2,
    borderBottomColor: "#264e36",
    paddingBottom: 4,
  },

  content: {
    padding: 16,
  },

  //card group labels
  categoryLabel: {
    backgroundColor: "#A47148",
    color: "#F5F0E6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 17,
    fontFamily: 'Quicksand_700Bold',
  },

  //eco buisness card grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "31%",
    marginBottom: 16,
  },

  //eco business card
  card: {
    backgroundColor: "#264e36",
    borderRadius: 10,
    padding: 8,
  },

  logoBox: {
    height: 60,
    backgroundColor: "#F5F0E6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  logoImage: {
    width: "90%",
    height: "90%"
  },

  cardName: {
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
    color: "#264e36",
    marginTop: 2.5,
    marginBottom: 6,
    textAlign: "center",
  },

  ptsRow: {
    backgroundColor: "#F5F0E6",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },

  ptsTxt: {
    color: "#1c4964",
    fontSize: 14,
    fontFamily: 'Quicksand_700Bold',
  },

  //map
  mapPlaceholder: {
    height: 445,
    backgroundColor: "#a47148",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  map: {
    flex: 1,
  },

  mapWrapper: {
    width: "90%",
    height: "92%",
    borderRadius: 6,
    overflow: "hidden",
  },

  mapSearchBar: {
    height: 50,
    backgroundColor: "#a47148",
    borderRadius: 29,
    justifyContent: "center",
    paddingHorizontal: 18,
    marginBottom: 15,
  },

  input: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: "white",
  },
});