import React, { useState, useEffect } from "react";
import { ActivityIndicator, Button, FlatList, Text, TextInput, StyleSheet, View, ViewStyle } from "react-native";
import { connectSocket } from "../../src/socket";
import { Socket } from "socket.io-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../src/models/chatMessage";
import { useLocalSearchParams } from "expo-router";

type MessageBubbleProps = {
  chatMessage: ChatMessage;
  mySocketID?: string;
};

const MessageBubble = ({ chatMessage, mySocketID }: MessageBubbleProps) => {
  let bubbleStyle = [styles.bubbleBase];
  let containerStyle = { alignItems: "flex-start" as ViewStyle["alignItems"] };

  if (chatMessage.socketid === mySocketID) {
    bubbleStyle.push(styles.myMessage);
    containerStyle = { alignItems: "flex-end" };
  }

  if (chatMessage.socketid === "server") {
    bubbleStyle.push(styles.serverMessage);
    containerStyle = { alignItems: "center" };
  }

  return (
    <View style={[{ width: "100%", marginVertical: 5 }, containerStyle]}>
      <View style={{ maxWidth: "80%" }}>
        {chatMessage.user && chatMessage.socketid !== mySocketID && (
          <Text style={styles.userLabel}>{chatMessage.user}</Text>
        )}
        <View style={bubbleStyle}>
          <Text style={styles.messageText}>{chatMessage.message}</Text>
        </View>
        <Text style={styles.timestamp}>{chatMessage.time}</Text>
      </View>
    </View>
  );
};

type lsp = {
  user: string;
};

export default function ChatScreen() {
  const { user } = useLocalSearchParams<lsp>();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isloading, setLoading] = useState<boolean>(true);
  const [mySocketID, setMySocketID] = useState<string>();

  useEffect(() => {
    connectSocket(user).then((socket) => {
      setSocket(socket);
      setLoading(false);
      setMySocketID(socket?.id);
    }).catch(error => console.error(error));

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    socket?.on("connected", ({ socketID }) => {
      setMySocketID(socketID);
    });
    socket?.on("message", (message: ChatMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket?.off("message");
    };
  }, [socket]);

  const sendMessage = () => {
        if (message.trim()) {
            socket?.emit("message", message);
            setMessage("");
        }
    };

  if (isloading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble chatMessage={item} mySocketID={mySocketID} />
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe un mensaje"
          placeholderTextColor="#aaa"
        />
        <View style={styles.buttonWrapper}>
          <Button title="Enviar" onPress={sendMessage} color="#4CAF50" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  bubbleBase: {
    backgroundColor: "#426FAE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  } as ViewStyle,
  myMessage: {
    backgroundColor: "#3AB67E",
  } as ViewStyle,
  serverMessage: {
    backgroundColor: "#000",
  } as ViewStyle,
  userLabel: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
    marginBottom: 2,
  } as ViewStyle,
  timestamp: {
    fontSize: 10,
    color: "#aaa",
    alignSelf: "flex-end",
    marginTop: 2,
    marginRight: 5,
  } as ViewStyle,
  messageText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});



