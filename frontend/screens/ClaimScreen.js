import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; 
const USER_ID = 1; // Geçici kullanıcı ID'si

export default function ClaimScreen({ route }) {
  const { drop_id, drop_baslik } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [claimCode, setClaimCode] = useState(null);
  const [message, setMessage] = useState("Hak kazanıp kazanmadığını görmek için Claim Et butonuna bas.");

  useEffect(() => {
    checkInitialClaimStatus();
  }, []);

  const checkInitialClaimStatus = async () => {
    setLoading(true);
    try {
        const res = await axios.post(
            `${API_URL}/claim?user_id=${USER_ID}&drop_id=${drop_id}`
        );
        
        if (res.data.claim_kodu) {
            setClaimCode(res.data.claim_kodu);
            setMessage("Hakkını zaten kullandın. Kodun aşağıdadır.");
        }
        
    } catch (err) {
        setMessage("Hak kazanıp kazanmadığını görmek için Claim Et butonuna bas.");
        setClaimCode(null);

    } finally {
        setLoading(false);
    }
  };

  const handleClaim = async () => {
    setLoading(true);
    setMessage("Hak talebin kontrol ediliyor...");
    
    try {
      const res = await axios.post(
        `${API_URL}/claim?user_id=${USER_ID}&drop_id=${drop_id}`
      );
      
      const newCode = res.data.claim_kodu;
      
      setClaimCode(newCode);
      setMessage(res.data.mesaj || "Tebrikler! Claim kodun başarıyla oluşturuldu.");

    } catch (err) {
      const detail = err.response?.data?.detail || "Bir hata oluştu";
      Alert.alert("Claim Başarısız", detail);
      setMessage(`Hata: ${detail}`); 

    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>🎟 {drop_baslik} Claim Penceresi</Text>
          <Text style={styles.desc}>{message}</Text>

          {loading ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Claim durumu kontrol ediliyor...</Text>
            </View>
          ) : claimCode ? (
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Senin Claim Kodun:</Text>
              <Text style={styles.code}>{claimCode}</Text>
              <Text style={styles.infoText}>Bu kod tek kullanımlıktır ve stoktan düşülmüştür.</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleClaim}>
              <Text style={styles.buttonText}>Hakkımı Şimdi Claim Et</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    padding: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
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
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  desc: {
    color: "#555",
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  loaderContainer: {
      padding: 20,
      alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      color: '#007bff',
      fontWeight: '600',
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  codeBox: {
    backgroundColor: "#eaf4ff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    width: '100%',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  codeLabel: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: '600',
  },
  code: {
    fontSize: 36,
    fontWeight: "800",
    color: "#333",
    marginTop: 10,
    letterSpacing: 3,
  },
  infoText: {
      marginTop: 15,
      fontSize: 13,
      color: '#777',
      textAlign: 'center',
  },
});