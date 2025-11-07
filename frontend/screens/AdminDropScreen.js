import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  SafeAreaView
} from "react-native";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; 
const ADMIN_ID = 1;

export default function AdminDropScreen() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDrop, setCurrentDrop] = useState(null); // Güncellenen/Yeni drop

  // Form State'leri
  const [baslik, setBaslik] = useState('');
  const [stok, setStok] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kisa_aciklama, setKisaAciklama] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [claim_baslangic, setClaimBaslangic] = useState(''); // UTC formatında tarih

  useEffect(() => {
    fetchDrops();
  }, []);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/drops/`);
      setDrops(res.data);
    } catch (err) {
      Alert.alert("Hata", "Drop listesi yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
      setCurrentDrop(null);
      setBaslik('');
      setStok('');
      setAciklama('');
      setKisaAciklama('');
      setImageUrl('');
      setClaimBaslangic('');
  };
  
  const openModalForEdit = (drop) => {
      setCurrentDrop(drop);
      setBaslik(drop.baslik);
      setStok(String(drop.stok));
      setAciklama(drop.aciklama || '');
      setKisaAciklama(drop.kisa_aciklama || '');
      setImageUrl(drop.image_url || '');
      setClaimBaslangic(drop.claim_baslangic); 
      setModalVisible(true);
  };

  const handleSave = async () => {
    const data = {
        baslik,
        stok: parseInt(stok),
        aciklama: aciklama || undefined,
        kisa_aciklama: kisa_aciklama || undefined,
        image_url: image_url || undefined,
        claim_baslangic: claim_baslangic || undefined,
    };
    
    try {
        if (currentDrop) {
            // Güncelleme (PUT)
            await axios.put(`${API_URL}/drops/admin/${currentDrop.id}?user_id=${ADMIN_ID}`, data);
            Alert.alert("Başarılı", "Drop güncellendi.");
        } else {
            // Yeni Ekleme (POST)
            await axios.post(`${API_URL}/drops/admin?user_id=${ADMIN_ID}`, data);
            Alert.alert("Başarılı", "Yeni Drop eklendi.");
        }
        
        setModalVisible(false);
        fetchDrops();
    } catch (err) {
        Alert.alert("Hata", err.response?.data?.detail || "İşlem başarısız.");
    }
  };
  
  const handleDelete = async (dropId) => {
    Alert.alert(
        "Emin Misiniz?", 
        "Bu drop kalıcı olarak silinecektir.",
        [
            { text: "İptal" },
            { 
                text: "Sil", 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`${API_URL}/drops/admin/${dropId}?user_id=${ADMIN_ID}`);
                        Alert.alert("Başarılı", "Drop başarıyla silindi.");
                        fetchDrops();
                    } catch (err) {
                        Alert.alert("Hata", err.response?.data?.detail || "Silme başarısız.");
                    }
                }
            }
        ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.dropRow}>
      <Text style={styles.dropTitle}>{item.id}. {item.baslik}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openModalForEdit(item)}>
          <Text style={styles.editText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Admin Paneli | Drop Yönetimi</Text>
      
      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>+ Yeni Drop Ekle</Text>
      </TouchableOpacity>
      
      <FlatList
        data={drops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{currentDrop ? "Drop Düzenle" : "Yeni Drop Ekle"}</Text>
          
          <TextInput placeholder="Başlık" style={styles.input} value={baslik} onChangeText={setBaslik} />
          <TextInput placeholder="Stok (Sayı)" style={styles.input} value={stok} onChangeText={setStok} keyboardType="numeric" />
          <TextInput placeholder="Kısa Açıklama" style={styles.input} value={kisa_aciklama} onChangeText={setKisaAciklama} />
          <TextInput placeholder="Detaylı Açıklama" style={[styles.input, { height: 80 }]} value={aciklama} onChangeText={setAciklama} multiline />
          <TextInput placeholder="Resim URL (http://...)" style={styles.input} value={image_url} onChangeText={setImageUrl} />
          <TextInput placeholder="Claim Başlangıç (örn: 2025-01-01T10:00:00Z)" style={styles.input} value={claim_baslangic} onChangeText={setClaimBaslangic} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{currentDrop ? "Kaydet" : "Ekle"}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    padding: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dropRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  editText: {
    color: "#007bff",
    fontWeight: '600',
  },
  deleteText: {
    color: "#dc3545",
    fontWeight: '600',
  },
  modalView: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6c757d',
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  }
});