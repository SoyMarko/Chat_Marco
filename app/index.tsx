import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { Button, Text, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function () {
    const [username, setUsername] = useState<string>('');

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Text style={styles.title}>Bienvenido al Chat</Text>
            <TextInput
                placeholder="Ingresa tu nombre"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                placeholderTextColor="#aaa"
            />
            <Link
                href={{ pathname: "/(chat)/chat", params: { user: username } }}
                asChild
            >
                <View style={styles.button}>
                    <Button title="Entrar" color="#4CAF50" />
                </View>
            </Link>
            
            {/*
            <Link href="/settings">
                <Text style={styles.link}>Configuración</Text>
            </Link>
            */}


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f5f5f5",
        padding: 24,
        gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    button: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    link: {
        marginTop: 10,
        color: '#426FAE',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
