import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";

export default function DropListScreen({ navigation }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/drops")
      .then(res => setDrops(res.data))
      .catch(err => console.log("API hatası:", err.message));
  }, []);

  const renderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("Detail", { drop: item })}
    style={{
      padding: 15,
      marginVertical: 6,
      backgroundColor: "#f1f1f1",
      borderRadius: 8
    }}
  >
    <Text style={{ fontWeight: "bold" }}>{item.baslik}</Text>
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
