import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

const LOGO_URL = "https://www.alpacotech.com/logo.png";

export default function LoginScreen({ navigation, route, setAuthenticated, setIsAdmin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });
      Alert.alert("Hoş geldin!", "Giriş başarılı");
      if (setIsAdmin) { // Prop'un varlığını kontrol et
          setIsAdmin(res.data.is_admin);
      }
      setAuthenticated(true);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.detail || "Giriş başarısız");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: LOGO_URL }} style={styles.logo} />
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        placeholder="E-posta"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Şifre"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    padding: 25,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  logo: {
    width: 250, 
    height: 250, 
    resizeMode: 'contain', 
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    color: "#007bff",
    textAlign: "center",
  },
});
