import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; 

export default function DropListScreen({ navigation, isAdmin }) {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/drops`) 
      .then((res) => {
        setDrops(res.data);
      })
      .catch((err) => {
        console.log("API hatası:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: '#555' }}>Drop'lar Yükleniyor...</Text>
      </View>
    );
  }
  
  if (drops.length === 0) {
      return (
          <View style={styles.center}>
              <Text style={styles.noDropsText}>Şu anda aktif bir Drop bulunmamaktadır. ⏳</Text>
          </View>
      );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Aktif':
        return { backgroundColor: '#e6ffed', color: '#008000' }; // Yeşil
      case 'Çok Yakında':
        return { backgroundColor: '#fffbe6', color: '#cc8800' }; // Sarı
      default:
        return { backgroundColor: '#f4f5f7', color: '#555' };
    }
  };

  const renderItem = ({ item }) => {
    const statusText = item.durum || 'Aktif'; 
    const statusStyles = getStatusStyle(statusText);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Detail", { drop: item })}
        activeOpacity={0.8}
      >
        <View style={styles.headerRow}>
            <Text style={styles.title}>{item.baslik}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyles.backgroundColor }]}>
                <Text style={[styles.statusText, { color: statusStyles.color }]}>{statusText}</Text>
            </View>
        </View>
        
        <Text style={styles.description}>{item.kisa_aciklama || "Özel ürünün sınırlı stoğu yakında yayınlanacak."}</Text>

        <View style={styles.footerRow}>
            <Text style={styles.stockText}>Kalan Stok: **{item.stok} Adet**</Text>
            <Text style={styles.detailLink}>Detayları Gör →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <View style={styles.container}>
        <Text style={styles.header}>✨Aktif Drop'lar</Text>
        {isAdmin && (
                <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() => navigation.navigate("Admin")}
                >
                    <Text style={styles.adminButtonText}>Admin</Text>
                </TouchableOpacity>
            )}
        <FlatList
          data={drops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          // Daha iyi bir padding için listeye padding ekleyelim
          contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    headerContainer: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        marginBottom: 20,
    },
    mainHeader: {
        fontSize: 26,
        fontWeight: "800",
        color: "#222",
    },
    adminButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    adminButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#f4f5f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
  },
  noDropsText: {
    fontSize: 18,
    color: "#777",
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    flexShrink: 1,
  },
  description: {
      color: "#555",
      marginBottom: 12,
      fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
      fontSize: 12,
      fontWeight: '700',
  },
  footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#eee',
  },
  stockText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  detailLink: {
      color: "#007bff",
      fontWeight: '600',
      fontSize: 14,
  }
});