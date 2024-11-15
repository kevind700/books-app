import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { books } from "./index";

export default function BookDetails() {
  const { id } = useLocalSearchParams();
  const book = books.find((b) => b.id === id);
  const [currentPage, setCurrentPage] = useState(0);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Libro no encontrado</Text>
      </View>
    );
  }

  const handleNextPage = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
