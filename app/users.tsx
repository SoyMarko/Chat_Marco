import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Socket } from "socket.io-client";
import { connectSocket } from "../src/socket";
import { FlatList, Text } from "react-native";
import { data } from "react-router-dom";

interface ConnectedUser {
    sockedId: string;
    user: string;
};

export default () => {
    const { user } = useLocalSearchParams<{ user: string }>();
    const [socket, setSocket] = useState<Socket>();
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        connectSocket(user).then(socket => {
            setSocket(socket);
        });
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('users:update', data => setUsers(data.users));
        return (() => {
            socket.off('users:update');
        });
    }, [socket]);

    return (
        <SafeAreaView>
            <FlatList
                data={users}
                keyExtractor={(_e, i) => i.toFixed(0)}
                renderItem={({ item }) => <Text>{item}</Text>}

            />
        </SafeAreaView>
    )

}; 