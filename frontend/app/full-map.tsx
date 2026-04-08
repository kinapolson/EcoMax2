import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let MapView: any = null;

if (Platform.OS !== "web") {
    MapView = require("react-native-maps").default;
}

export default function FullMap() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* header */}
            <SafeAreaView edges={["top"]} style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={35} color="#F5F0E6" />
                </Pressable>

                <Text style={styles.title}>Map</Text>
            </SafeAreaView>

            {/* full screen map */}
            {Platform.OS === "web" ? (
                <View style={[styles.map, styles.webFallback]}>
                    <Text style={styles.webFallbackText}>
                        Full map is available on iOS/Android only.{"\n"}
                        (Web version for Docker grading)
                    </Text>
                </View>
            ) : (
                <MapView style={styles.map} />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#264E36",
    },

    map: {
        flex: 1,
    },

    header: {
        backgroundColor: "#264E36",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 35,
    },

    backBtn: {
        position: "absolute",
        left: 16,
    },

    title: {
        fontSize: 24,
        fontFamily: 'Quicksand_700Bold',
        color: "#F5F0E6",
        marginLeft: 130,
        marginTop: 20,
    },
    webFallback: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },

    webFallbackText: {
        color: "#F5F0E6",
        fontFamily: "Quicksand_700Bold",
        textAlign: "center",
        lineHeight: 22,
    },
});