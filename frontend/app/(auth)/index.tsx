import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OpeningScreen() {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/ecomax_light.png')} 
                style={{ width: 325, height: 325, marginTop: -90}}     
                resizeMode="contain"       
            />

            {/* login button */}
            <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
            >
                <Text style={styles.primaryTxt}>Login</Text>
            </TouchableOpacity>

            {/* signup button */}
            <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/signup")}
            >
                <Text style={styles.secondaryTxt}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    //body
    container: {
        flex: 1,
        backgroundColor: "#F5F0E6",
        justifyContent: "center",
        alignItems: "center",
    },

    //login button
    primaryButton: {
        backgroundColor: "#264E36",
        paddingVertical: 14, 
        paddingHorizontal: 90,
        borderRadius: 7,
        marginBottom: 16,
    },

    primaryTxt: {
        color: "#F5F0E6",
        fontSize: 17,
        fontFamily: 'Quicksand_700Bold',
    },

    //signup button
    secondaryButton: {
        backgroundColor: "#264E36",
        paddingVertical: 14, 
        paddingHorizontal: 80,
        borderRadius: 7,
        marginBottom: 16,
    },

    secondaryTxt: {
        color: "#F5F0E6",
        fontSize: 17,
        fontFamily: 'Quicksand_700Bold',
    },
});