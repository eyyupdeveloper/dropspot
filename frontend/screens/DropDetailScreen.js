import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

export default function DropDetailScreen({ route, navigation }) {
  const { drop } = route.params;

  const joinWaitlist = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/waitlist/join?user_id=1&drop_id=${drop.id}`
      );
      Alert.alert("Durum", res.data.mesaj);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.detail || "Bir şeyler ters gitti");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{drop.baslik}</Text>
        <Text style={styles.text}>Stok: {drop.stok}</Text>
        <TouchableOpacity style={styles.button} onPress={joinWaitlist}>
          <Text style={styles.buttonText}>Bekleme Listesine Katıl</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Claim")}
        >
          <Text style={[styles.buttonText, { color: "#007bff" }]}>
            Claim Sayfasına Git
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    color: "#444",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#e9f2ff",
  },
});
