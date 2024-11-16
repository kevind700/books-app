import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "@env";
import StatsWidget from "@/components/StatsWidget";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

interface Book {
  id: string;
  title: string;
  author: string;
  pages: string[];
}

interface ReadingStats {
  bookId: string;
  title: string;
  timeSpent: number;
  pageStats: Array<{
    page: number;
    time: number;
  }>;
  currentPage: number;
}

const BookItem = ({ book, onPress }: { book: Book; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.bookItem}>
    <Text style={styles.bookTitle}>{book.title}</Text>
    <Text style={styles.author}>Autor: {book.author}</Text>
    <Text style={styles.pages}>Páginas: {book.pages.length}</Text>
  </Pressable>
);

export default function LibraryScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRefreshStats((prev) => prev + 1);
    }, []),
  );

  const toggleStats = () => {
    const toValue = statsExpanded ? 0 : 350;
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false,
      friction: 10,
      tension: 50,
    }).start();
    setStatsExpanded(!statsExpanded);
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error al cargar los libros");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    router.push({
      pathname: "/library/[id]",
      params: { id: book.id, book: JSON.stringify(book) },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Biblioteca</Text>
        <Pressable onPress={toggleStats} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {statsExpanded ? "Ocultar" : "Ver"} Estadísticas
          </Text>
          <Ionicons
            name={statsExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#8B4513"
          />
        </Pressable>
      </View>

      <Animated.View
        style={[styles.statsContainer, { height: animatedHeight }]}
      >
        <StatsWidget refreshTrigger={refreshStats} />
      </Animated.View>

      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookItem book={item} onPress={() => handleBookPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  list: {
    padding: 16,
  },
  statsContainer: {
    overflow: "hidden",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C1810",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F0",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D4C4B7",
  },
  toggleButtonText: {
    color: "#8B4513",
    marginRight: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  bookItem: {
    backgroundColor: "#FFF9F0",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#2C1810",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C1810",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#4A3427",
    marginBottom: 4,
  },
  pages: {
    fontSize: 14,
    color: "#6B4F3E",
  },
});
