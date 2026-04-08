import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BusinessDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const [similarItems, setSimilarItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/get_b_items.php?item_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setItem(data.item);
          fetch(`http://localhost:8000/get_b_items.php?b_id=${data.item.b_id}`)
            .then(res => res.json())
            .then(data2 => {
              if (data2.status === "success") {
                const filtered = data2.items.filter((i:any) => i.id != id);
                setSimilarItems(filtered);
              }
            });
          }
      });
  }, [id]);

  if (!item) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/ecomax_icon_dark.png')}
          style={styles.image}
        />

        <Pressable onPress={() => router.push("/search")}>
          <Ionicons name="search" size={24} color="#F5F0E6" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back-outline" size={33} color="#264e36" />
        </TouchableOpacity>

        <View style={styles.itemThumbCard}>
          <View style={styles.imgWrapper}>
            <View style={styles.ptsBadge}>
              <Ionicons name="leaf" size={25} color="#F5F0E6" />
              <Text style={styles.ptsTxt}>{item.points}</Text>
            </View>

            <Image
              source={{ uri: `http://localhost:8000/items/${item.image}` }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.itemDescript}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.similarContainer}>
          <Text style={styles.title}>Similar Items</Text>
          <View style={styles.cardTitleDivider} />
          <View style={styles.itemsGrid}>
            {similarItems.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={styles.itemCard}
                onPress={() => router.push(`/eco-items/${business.id}`)}
              >
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color="#264e36"
                  style={styles.heart}
                />

                <Image
                  source={{ uri: `http://localhost:8000/items/${business.image}` }}
                  style={styles.itemImage}
                />

                <View style={styles.ptsRow}>
                  <Ionicons name="leaf" size={14} color="#1c4964" />
                  <Text style={styles.ecoPtsTxt}>{business.points}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create ({
  //body
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },

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
  },

  image: {
    height: 49,
    width: 37,
  },

  //back btn
  backBtn: {
    marginTop: 4,
    marginBottom: 20,
  },

  cardTitleDivider: {
    height: 1.6,
    backgroundColor: "#F5F0E6",
    marginVertical: 12,
  },

  //card grid
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  //card info
  itemThumbCard: {
    backgroundColor: "#A47148",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  
  thumbImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  imgWrapper: {
    position: "relative",
  },

  ptsBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: "#A47148",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  itemTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand_700Bold',
    color: "#F5F0E6",
  },

  itemInfo: {
    marginTop: 12,
  },

  price: {
    fontSize: 18,
    color: "#F5F0E6",
    marginVertical: 6,
    fontFamily: 'Poppins_400Regular',
  },

  itemDescript: {
    fontSize: 15,
    lineHeight: 22,
    color: "#F5F0E6",
    fontFamily: 'Poppins_400Regular',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Quicksand_700Bold',
    color: "#F5F0E6",
  },

  //brand logo placement
  brandLogoWrap: {
    position: "absolute",
    bottom: -35,
    right: 8,
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: "#5F5D34",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F5F0E6",
  },

  brandLogo: {
    width: "70%",
    height: "70%",
  },

  //similar items
  similarContainer: {
    backgroundColor: "#A47148",
    borderRadius: 12,
    padding: 12,
  },

  //item card layout
  itemCard: {
    backgroundColor: "#264e36",
    borderRadius: 10,
    padding: 8,
    marginBottom: 2,
    width: "31%",
    position: "relative",
  },

  heart: {
    position: "absolute",
    top: 6,
    right: 6,
  },

  itemImage: {
    height: 70,
    width: "100%",
    borderRadius: 6,
    marginBottom: 6,
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
    marginLeft: 4,
    fontWeight: "bold",
    color: "#F5F0E6",
    fontSize: 25,
  },

  ecoPtsTxt: {
    marginLeft: 4,
    fontWeight: "bold",
    color: "#1c4964",
    fontSize: 14,
  },
});