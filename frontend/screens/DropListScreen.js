import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";

export default function DropListScreen() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    axios.get("http://192.168.1.42:8000/drops")
      .then(res => setDrops(res.data))
      .catch(err => console.log("API hatası:", err.message));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#eee",
        borderRadius: 8
      }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.baslik}</Text>
      <Text>Stok: {item.stok}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 10 }}>
        Aktif Drop Listesi
      </Text>
      <FlatList
        data={drops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
