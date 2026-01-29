import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { sendChatMessage } from "../api/chatApi"; // adjust path if needed

export default function ChatScreen() {

    console.log("✅ ChatScreen.js LOADED - DEBUG 123");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(userText);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      const msg = e?.message || String(e);

      // ✅ FORCE the real error to display
      Alert.alert("Chat API Error", msg);

      // Also show in the chat history
      setMessages((prev) => [
        ...prev,
        { role: "error", text: `Error: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        DietBite Chat
      </Text>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((m, idx) => {
          const color =
            m.role === "user" ? "#22c55e" : m.role === "assistant" ? "#fff" : "#ff6b6b";

          const prefix =
            m.role === "user" ? "You: " : m.role === "assistant" ? "DietBite: " : "";

          return (
            <Text key={idx} style={{ color, marginBottom: 10, fontSize: 16 }}>
              {prefix}
              {m.text}
            </Text>
          );
        })}
      </ScrollView>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message..."
        placeholderTextColor="#777"
        autoCapitalize="sentences"
        style={{
          borderWidth: 1,
          borderColor: "#444",
          borderRadius: 10,
          padding: 12,
          color: "#fff",
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleSend}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#555" : "#22c55e",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "Sending..." : "Send"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
