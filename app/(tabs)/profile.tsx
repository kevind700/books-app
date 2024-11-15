import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)");
          } catch (error) {
            Alert.alert(
              "Error",
              "No se pudo cerrar sesión. Intente nuevamente.",
            );
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={100} color="#007AFF" />
        <Text
          style={styles.name}
        >{`${user?.firstName} ${user?.lastName}`}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
