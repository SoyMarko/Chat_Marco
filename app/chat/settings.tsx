import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Button, Text, TextInput, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const router = useRouter();
    const [serverAddress, setServerAddress] = useState("http://localhost:3000");

    useEffect(() => {
        (async () => {
            const localServerAddress = await AsyncStorage.getItem("serverAddress");
            if (localServerAddress) {
                setServerAddress(localServerAddress);
            }
        })();
    }, []);

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem("serverAddress", serverAddress);
            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Configuración del servidor</Text>
            <Text style={styles.label}>Dirección:</Text>
            <TextInput
                value={serverAddress}
                onChangeText={setServerAddress}
                placeholder="http://localhost:3000"
                style={styles.input}
                placeholderTextColor="#aaa"
            />
            <View style={styles.buttonContainer}>
                <Button title="Guardar" onPress={handleSave} color="#4CAF50" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
        color: "#333",
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 24,
    },
    buttonContainer: {
        borderRadius: 10,
        overflow: "hidden",
    },
});
