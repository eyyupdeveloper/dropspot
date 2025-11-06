import React from "react";
import { View, Text, Button, Alert } from "react-native";
import axios from "axios";

export default function DropDetailScreen({ route }) {
  const { drop } = route.params;

  const joinWaitlist = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/waitlist/join?user_id=1&drop_id=${drop.id}`
      );
      Alert.alert("Durum", res.data.mesaj);
    } catch (err) {
      Alert.alert(
        "Hata",
        err.response?.data?.detail || "Bir şeyler ters gitti :("
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{drop.baslik}</Text>
      <Text style={{ marginVertical: 10 }}>Stok: {drop.stok}</Text>
      <Button title="Bekleme Listesine Katıl" onPress={joinWaitlist} />
    </View>
  );
}