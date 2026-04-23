import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function SearchScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={33} color="#e6efe9" />
        </TouchableOpacity>

        {/* search bar */}
        <View style={styles.searchBar}>
          <TextInput placeholder="Search" placeholderTextColor="#e6efe9"
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#e6efe9" />
        </View>
      </View>

      <View style={styles.content}>
        {/* categories */}
        <Text style={styles.sectionLabel}>Categories</Text>

        <View style={styles.catRow}>
          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Retailers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Grocery</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.catRow}>
          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Beverages</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.catRow}>
          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Health & Wellness</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.catBtn}>
            <Text style={styles.catTxt}>Alcohol</Text>
          </TouchableOpacity>
        </View>

        {/* brands */}
        <Text style={styles.sectionLabel}>Brands</Text>

        <View style={styles.brandRow}>
          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/ia_logo.avif")}
              style={styles.brandLogo}
            />
          </View>

          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/gf_logo.png")}
              style={styles.brandLogo}
            />
          </View>

          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/l_logo.png")}
              style={styles.brandLogo}
            />
          </View>

          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/gp_logo.png")}
              style={styles.brandLogo}
            />
          </View>

          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/o_logo.png")}
              style={styles.brandLogo}
            />
          </View>

          <View style={styles.brandCircle}>
            <Image
              source={require("../assets/images/logos/pc_logo.png")}
              style={styles.brandLogo}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  //body
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },

  //content
  content: {
    padding: 16,
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
    height: 160,
  },

  //search bar
  searchBar: {
    backgroundColor: "#5ca377",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    color: "#F5F0E6",
    fontSize: 17,
    width: "90%",
    fontFamily: 'Poppins_700Bold',
  },

  //sections label
  sectionLabel: {
    backgroundColor: "#A47148",
    color: "#F5F0E6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    fontFamily: 'Quicksand_700Bold',
    marginBottom: 18,
    marginTop: 10,
    fontSize: 17,
  },

  //categoreis
  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  catBtn: {
    backgroundColor: "#264e36",
    width: "48%",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  catTxt: {
    color: "#F5F0E6",
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },

  //brands
  brandRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  brandCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e6e0c8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  brandLogo: {
    width: "65%",
    height: "65%",
    resizeMode: "contain",
  },
});