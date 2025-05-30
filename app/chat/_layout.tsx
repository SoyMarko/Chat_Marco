import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChatLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
