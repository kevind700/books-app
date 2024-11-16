import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Book {
  id: string;
  title: string;
  author: string;
  pages: string[];
}

export default function BookDetails() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const book = JSON.parse(params.book as string);
  const [currentPage, setCurrentPage] = useState(0);
  const pageStartTime = useRef<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const currentPageRef = useRef(0);

  useEffect(() => {
    loadSavedPage();
    return () => {
      saveReadingStats(currentPageRef.current);
    };
  }, []);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const loadSavedPage = async () => {
    try {
      if (user) {
        const stats = await AsyncStorage.getItem(`readingStats_${user.id}`);
        if (stats) {
          const parsedStats = JSON.parse(stats);
          const bookStats = parsedStats.find((s: any) => s.bookId === book.id);
          if (bookStats) {
            setCurrentPage(bookStats.currentPage);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading saved page:", error);
      setIsLoading(false);
    }
  };

  const saveReadingStats = async (pageToSave: number) => {
    try {
      if (user) {
        const timeSpent = Date.now() - pageStartTime.current;
        const stats = await AsyncStorage.getItem(`readingStats_${user.id}`);
        const parsedStats = stats ? JSON.parse(stats) : [];

        const bookStatsIndex = parsedStats.findIndex(
          (s: any) => s.bookId === book.id,
        );

        if (bookStatsIndex >= 0) {
          const existingPageStatIndex = parsedStats[
            bookStatsIndex
          ].pageStats.findIndex((stat: any) => stat.page === pageToSave);

          if (existingPageStatIndex >= 0) {
            parsedStats[bookStatsIndex].pageStats[existingPageStatIndex].time +=
              timeSpent;
          } else {
            parsedStats[bookStatsIndex].pageStats.push({
              page: pageToSave,
              time: timeSpent,
            });
          }

          parsedStats[bookStatsIndex].timeSpent += timeSpent;
          parsedStats[bookStatsIndex].currentPage = pageToSave;
        } else {
          parsedStats.push({
            bookId: book.id,
            title: book.title,
            timeSpent: timeSpent,
            pageStats: [
              {
                page: pageToSave,
                time: timeSpent,
              },
            ],
            currentPage: pageToSave,
          });
        }

        await AsyncStorage.setItem(
          `readingStats_${user.id}`,
          JSON.stringify(parsedStats),
        );
      }
    } catch (error) {
      console.error("Error saving reading stats:", error);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < book.pages.length - 1) {
      await saveReadingStats(currentPage);
      setCurrentPage(currentPage + 1);
      pageStartTime.current = Date.now();
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 0) {
      await saveReadingStats(currentPage);
      setCurrentPage(currentPage - 1);
      pageStartTime.current = Date.now();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>Autor: {book.author}</Text>
        <Text style={styles.pageNumber}>
          Página {currentPage + 1} de {book.pages.length}
        </Text>

        <View style={styles.readerContainer}>
          <Text style={styles.pageContent}>{book.pages[currentPage]}</Text>
        </View>
      </ScrollView>

      <View style={styles.navigationButtons}>
        <Pressable
          onPress={handlePreviousPage}
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]}
          disabled={currentPage === 0}
        >
          <Text style={styles.navButtonText}>← Anterior</Text>
        </Pressable>

        <Pressable
          onPress={handleNextPage}
          style={[
            styles.navButton,
            currentPage === book.pages.length - 1 && styles.disabledButton,
          ]}
          disabled={currentPage === book.pages.length - 1}
        >
          <Text style={styles.navButtonText}>Siguiente →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6D3",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2C1810",
    fontFamily: "System",
  },
  author: {
    fontSize: 20,
    color: "#4A3427",
    marginBottom: 8,
    fontFamily: "System",
  },
  pageNumber: {
    fontSize: 16,
    color: "#6B4F3E",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "System",
  },
  readerContainer: {
    flex: 1,
    backgroundColor: "#FFF9F0",
    padding: 24,
    borderRadius: 4,
    minHeight: 400,
    marginVertical: 20,
    shadowColor: "#2C1810",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#D4C4B7",
  },
  pageContent: {
    fontSize: 18,
    lineHeight: 28,
    color: "#2C1810",
    fontFamily: "System",
    letterSpacing: 0.3,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#E6D5C3",
    borderTopWidth: 1,
    borderTopColor: "#D4C4B7",
  },
  navButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  navButtonText: {
    color: "#FFF9F0",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  disabledButton: {
    backgroundColor: "#C4B5A8",
  },
});
