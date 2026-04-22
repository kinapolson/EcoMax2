import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function ScanScreen() {
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    
    if (!permission) {
        return <View style={{ flex: 1, backgroundColor: "#161618" }} />;
    }

    if (!permission.granted) {
        return (
        <View style={styles.center}>
            <Text style={styles.txt}>Camera access is required</Text>
            <TouchableOpacity onPress={requestPermission} style={styles.button}>
                <Text style={styles.buttonTxt}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
        );
    }

    const takePicture = async () => {
    if (!cameraRef.current || loading) return;
    setLoading(true);

    try {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
            skipProcessing: false,
        });

        const processed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 2000 } }],
        {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
        }
        );

        const enhanced = await ImageManipulator.manipulateAsync(
            processed.uri,
        [],
        {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
        }
        );
        
        const formData = new FormData();
        formData.append("user_id", "1");

        const uriParts = enhanced.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("receipt", {
            uri: enhanced.uri,
            name: `receipt.${fileType}`,
            type: `image/${fileType}`,
        });

        const response = await fetch("http://localhost:8000/scan_receipt.php", {
            method: "POST",
            body: formData,
        });

        const text = await response.text();
        console.log("SERVER RESPONSE:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (err) {
            Alert.alert("Server Error", text);
            setLoading(false);
            return;
        }

        if (data.status === "pending") {
            Alert.alert(
                "Confirm Receipt",
                `Business: ${data.business}
Total: $${data.total}
Points: ${data.points}`,
                [
                    {
                        text: "No",
                        onPress: () => setLoading(false)
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            try {
                                const confirmRes = await fetch("http://localhost:8000/confirm_receipt.php", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        user_id: 1,
                                        fileName: data.fileName,
                                        business: data.business,
                                        total: data.total,
                                        points: data.points,
                                        items: data.items,
                                    }),
                                });

                                const confirmData = await confirmRes.json();

                                if (confirmData.status === "success") {
                                    Alert.alert("Saved", "Receipt stored and points added");
                                } else {
                                    Alert.alert("Error", "Failed to save receipt");
                                }
                            } catch (err: any) {
                                Alert.alert("Error", err.message);
                            }

                            setLoading(false);
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Scan Failed", data.message);
            setLoading(false);
        }

    } catch (err: any) {
        Alert.alert("Error", err.message);
        setLoading(false);
    }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                source={require("../../assets/images/ecomax_icon_dark.png")}
                style={styles.image}
                />
            </View>

            <CameraView ref={cameraRef} style={styles.camera} />

            <View style={styles.topbar}>
                <TouchableOpacity style={styles.optBtn} onPress={() => router.back()}>
                <Ionicons name="close" size={22} color="#F5F0E6" />
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.optBtn}
                onPress={() => router.push("/tutorial/tp1")}
                >
                <Ionicons name="help" size={22} color="#F5F0E6" />
                </TouchableOpacity>
            </View>

            <View style={styles.scanBtn}>
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <Ionicons name="camera" size={28} color="#F5F0E6" />
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#F5F0E6" />
                <Text style={{ color: "#F5F0E6", marginTop: 10, fontSize: 18 }}>
                    Scanning...
                </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, backgroundColor: "#161618" 
    },

    header: {
        backgroundColor: "#264e36",
        paddingTop: 70,
        paddingBottom: 20,
        paddingLeft: 25,
    },

    image: { 
        height: 49, 
        width: 37 
    },

    camera: { 
        flex: 1 
    },

    topbar: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    optBtn: {
        width: 34,
        height: 34,
        borderRadius: 18,
        backgroundColor: "#5ca377",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#F5F0E6",
        marginTop: 110,
    },

    scanBtn: { 
        position: "absolute", 
        bottom: 40, 
        alignSelf: "center" 
    },

    captureBtn: {
        backgroundColor: "#5ca377",
        width: 91,
        height: 91,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#F5F0E6",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    txt: { 
        color: "#F5F0E6", 
        marginBottom: 10 
    },

    button: {
        backgroundColor: "#5ca377",
        padding: 12,
        borderRadius: 10,
    },

    buttonTxt: { 
        color: "#F5F0E6", 
        fontWeight: "bold" },

    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});