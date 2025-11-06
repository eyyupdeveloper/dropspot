import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function ClaimScreen() {
  const [loading, setLoading] = useState(false);
  const [claimCode, setClaimCode] = useState(null);

  const handleClaim = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/claim?user_id=1&drop_id=1"
      );
      setClaimCode(res.data.claim_kodu);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.detail || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>🎟 Claim Zamanı</Text>
        <Text style={styles.desc}>
          Eğer hak kazandıysan aşağıdaki butona basarak kodunu alabilirsin.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : claimCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Senin Kodun:</Text>
            <Text style={styles.code}>{claimCode}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleClaim}>
            <Text style={styles.buttonText}>Claim Et</Text>
          </TouchableOpacity>
        )}
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
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  desc: {
    color: "#444",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  codeBox: {
    backgroundColor: "#eaf4ff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 16,
    color: "#555",
  },
  code: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007bff",
    marginTop: 5,
  },
});
