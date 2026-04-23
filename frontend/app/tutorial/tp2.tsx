import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TutorialScreen() {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}> 
        {/* logo */} 
        <Image source={require('../../assets/images/ecomax_icon_dark.png')} 
          style={styles.image}
        /> 
        
        {/* title */}
        <Text style={styles.headerTitle}>Tutorial</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.push("/scan")}>
          <Ionicons name="close" size={22} color="#F5F0E6" />
        </TouchableOpacity>

        <View style={styles.tutContainer}>
          <Text style={styles.title}>Step 2: Recognition and Eco Point Calculation</Text>
          <Text style={styles.txt}>
            {'\n'}{'\n'}This app will detect:{'\n'}{'\n'}{'\n'}
            {'\t'}a. Store Name{'\n'}
            {'\t'}b. Purchase date{'\n'}
            {'\t'}c. Item list{'\n'}
            {'\t'}d. Total amout{'\n'}{'\n'}{'\n'}
            Eco Points are awarded based on recognized items and shop participation.
          </Text>
        </View>

        {/* nav buttons */}
        <View style={styles.navBtnsArea}>
          {/* back btn */}
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}
          >
            <Ionicons name="chevron-back-outline" size={22} color="#264e36" />
          </TouchableOpacity>
          
          {/* forward btn */}
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnNxt]} 
            onPress={() => router.push("/tutorial/tp3")}
          >
            <Ionicons name="chevron-forward-outline" size={22} color="#F5F0E6" />
          </TouchableOpacity>
        </View> 
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  //body
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },

  //content
  content :{
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

  headerTitle: {
    fontSize: 24,
    fontFamily: "Quicksand_700Bold",
    color: "#F5F0E6",
    right: 134,
  },

  //close btn
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: "#264e36",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  //tutorial
  tutContainer: {
    backgroundColor: "#264e36",
    borderRadius: 10,
    padding: 10,
    marginTop: 25,
    paddingBottom: 50,
  },

  title: {
    fontSize: 25,
    fontFamily: 'Quicksand_700Bold',
    marginBottom: 12,
    color: "#F5F0E6",
  },

  txt: {
    fontSize: 20,
    lineHeight: 22,
    color: "#F5F0E6",
    fontFamily: 'Poppins_400Regular',
  },

  //nav btns
  navBtnsArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 20,
  },

  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D9D6CC",
    justifyContent: "center",
    alignItems: "center",
  },

  navBtnNxt: {
    backgroundColor: "#264E36",
  },
});