import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BusinessDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const itemId = Number(id) || 0;
  const [items,setItems] = useState<any[]>([]);
  const [business,setBusiness] = useState<any>(null);

  useEffect(()=>{
    fetch(`http://localhost:8000/business_details.php?id=${itemId}`)
      .then(res=>res.json())
      .then(data=>{
        if(data.status==="success"){
          setBusiness(data.business);
        }
      });

    fetch(`http://localhost:8000/get_b_items.php?b_id=${itemId}`)
      .then(res=>res.json())
      .then(data=>{
        if(data.status==="success"){
          setItems(data.items);
        }
      });
    },[itemId]);

  if(!business) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/ecomax_icon_dark.png')}
          style={styles.image}
        />

        <Pressable onPress={()=>router.push("/search")}>
          <Ionicons name="search" size={24} color="#F5F0E6"/>
        </Pressable>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={()=>router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back-outline" size={33} color="#264e36"/>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.title}>{business.name}</Text>
          <View style={styles.cardTitleDivider}/>
          <Text style={styles.description}>
            {business.description}
          </Text>
        </View>

        <View style={styles.featuredContainer}>
          <Text style={styles.title}>Featured Items</Text>
          <View style={styles.cardTitleDivider}/>
          <View style={styles.itemsGrid}>
            {items.map((item)=> (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={()=>router.push(`/eco-items/${item.id}`)}
              >
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color="#F5F0E6"
                  style={styles.heart}
                />

                <Image
                  source={{uri:`http://localhost:8000/items/${item.image}`}}
                  style={styles.itemImage}
                />

                <View style={styles.ptsRow}>
                  <Ionicons name="leaf" size={14} color="#1c4964" />
                  <Text style={styles.ptsTxt}>{item.points}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#F5F0E6"
  },

  content:{
    padding:16
  },

  header:{
    backgroundColor:"#264e36",
    paddingTop:70,
    paddingBottom:20,
    paddingLeft:25,
    paddingRight:20,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  image:{
    height:49,
    width:37
  },

  backBtn:{
    marginTop:12,
    marginBottom:20
  },

  infoCard:{
    backgroundColor:"#A47148",
    borderRadius:12,
    padding:16,
    marginBottom:16
  },

  title:{
    fontSize:20,
    color:"#F5F0E6",
    fontFamily:'Quicksand_700Bold'
  },

  description:{
    fontSize:15,
    color:"#F5F0E6",
    lineHeight:22,
    fontFamily:'Poppins_400Regular'
  },

  cardTitleDivider:{
    height:1.6,
    backgroundColor:"#F5F0E6",
    marginVertical:12
  },

  featuredContainer:{
    backgroundColor:"#A47148",
    borderRadius:12,
    padding:12
  },

  itemsGrid:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between"
  },

  itemCard:{
    backgroundColor:"#264e36",
    borderRadius:10,
    padding:8,
    marginBottom:2,
    width:"31%",
    position:"relative"
  },

  heart:{
    position:"absolute",
    top:6,
    right:6,
    zIndex:10
  },

  itemImage:{
    height:70,
    width:"100%",
    borderRadius:6,
    marginBottom:6
  },

  ptsRow:{
    backgroundColor: "#F5F0E6",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },

  ptsTxt:{
    marginLeft:4,
    fontFamily:'Quicksand_700Bold',
    color:"#1c4964"
  }
});