import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; 
const USER_ID = 1; 

export default function DropDetailScreen({ route, navigation }) {
  const { drop } = route.params;
  
  const [isJoined, setIsJoined] = useState(false); 
  const [isClaimed, setIsClaimed] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const claimDate = new Date(drop.claim_baslangic);
  const claimTimeText = claimDate.toLocaleString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const isClaimWindowOpen = new Date() >= claimDate;
  
  const checkInitialStatus = async () => {
      setLoadingStatus(true);

      try {
          const claim_res = await axios.post(`${API_URL}/claim?user_id=${USER_ID}&drop_id=${drop.id}`);
          
          if(claim_res.data.claim_kodu) {
              setIsClaimed(true);
              setIsJoined(true); 
          }
      } catch (err) {
          try {
              const join_res = await axios.post(`${API_URL}/waitlist/join?user_id=${USER_ID}&drop_id=${drop.id}`);
              
              if (join_res.data.mesaj.includes("Zaten bekleme listesinde")) {
                  setIsJoined(true);
              } else {
                  // Eğer backend'de /waitlist/leave yoksa bu kısmı atlayın:
                  // await axios.post(`${API_URL}/waitlist/leave?user_id=${USER_ID}&drop_id=${drop.id}`);
                  setIsJoined(false); 
              }
          } catch(e) {
             setIsJoined(false);
          }
      } finally {
          setLoadingStatus(false);
      }
  };

  useEffect(() => {
    checkInitialStatus();
  }, [drop.id]);

  const handleWaitlistAction = async (action) => {
    const endpoint = action === 'join' ? '/waitlist/join' : '/waitlist/leave'; 
    const method = action === 'join' ? 'Bekleme Listesine Katıl' : 'Bekleme Listesinden Ayrıl';
    
    try {
      const res = await axios.post(
        `${API_URL}${endpoint}?user_id=${USER_ID}&drop_id=${drop.id}`
      );
      
      Alert.alert("Başarılı", res.data.mesaj || `${method}ma işlemi başarılı.`);
      setIsJoined(action === 'join');

    } catch (err) {
      Alert.alert("Hata", err.response?.data?.detail || `${method}ma başarısız.`);
    }
  };

  const WaitlistButton = () => {
    if (loadingStatus) {
        return <ActivityIndicator size="small" color="#007bff" style={styles.button} />;
    }
      
    if (isClaimed) {
        return <Text style={styles.claimedText}>Bu Drop için hakkınızı zaten kullandınız.</Text>
    }
      
    if (isJoined) {
      return (
        <TouchableOpacity 
          style={[styles.button, styles.leaveButton]} 
          onPress={() => handleWaitlistAction('leave')}
        >
          <Text style={styles.buttonText}>✓ Listeden Ayrıl</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleWaitlistAction('join')}
        >
          <Text style={styles.buttonText}>Bekleme Listesine Katıl</Text>
        </TouchableOpacity>
      );
    }
  };
  
  const ClaimButton = () => {
      if (!isClaimWindowOpen) {
          return (
            <TouchableOpacity style={[styles.button, styles.claimButton, styles.disabledButton]} disabled={true}>
              <Text style={styles.buttonText}>Claim Zamanı Gelmedi</Text>
            </TouchableOpacity>
          );
      }
      
      if (!isJoined && !isClaimed) {
          return (
            <TouchableOpacity style={[styles.button, styles.claimButton, styles.disabledButton]} disabled={true}>
              <Text style={styles.buttonText}>Önce Bekleme Listesine Katıl</Text>
            </TouchableOpacity>
          );
      }
      
      return (
        <TouchableOpacity
          style={[styles.button, styles.claimButton]}
          onPress={() => navigation.navigate("Claim", { drop_id: drop.id, drop_baslik: drop.baslik })}
        >
          <Text style={styles.buttonText}>
            {isClaimed ? "Claim Kodunu Gör" : "Claim Penceresine Git"}
          </Text>
        </TouchableOpacity>
      );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <ScrollView style={styles.container}>
        <Image 
            source={{ uri: drop.image_url || 'https://via.placeholder.com/600x300' }} 
            style={styles.dropImage} 
        />
        
        <View style={styles.card}>
          <Text style={styles.title}>{drop.baslik}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kalan Stok:</Text>
            <Text style={styles.infoValue}>{drop.stok} Adet</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Claim Başlangıç:</Text>
            <Text style={styles.infoValue}>{claimTimeText}</Text>
          </View>
          
          <View style={styles.separator} />

          <Text style={styles.descriptionHeader}>Açıklama</Text>
          <Text style={styles.descriptionText}>{drop.aciklama || drop.kisa_aciklama || "Drop için detaylı açıklama henüz sağlanmadı."}</Text>

          <View style={styles.separator} />
          
          <WaitlistButton /> 
          <ClaimButton />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  dropImage: {
    width: '100%',
    height: 250, 
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: "#222",
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#777",
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  descriptionText: {
    color: "#555",
    marginBottom: 10,
    lineHeight: 22,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: "#e83a3a", 
  },
  claimButton: {
    backgroundColor: "#007bff",
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.8,
  },
  claimedText: {
    fontSize: 16,
    color: '#008000',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#e6ffed',
    borderRadius: 10,
    marginBottom: 10,
  }
});