import { View, Text, FlatList, StyleSheet } from "react-native";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
}

const books: Book[] = [
  {
    id: "1",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    genre: "Realismo mágico",
    description:
      "Historia de la familia Buendía a lo largo de siete generaciones en Macondo.",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genre: "Ficción distópica",
    description:
      "Una sociedad totalitaria donde el gobierno mantiene el poder mediante el control de la información.",
  },
];

const BookItem = ({ book }: { book: Book }) => (
  <View style={styles.bookItem}>
    <Text style={styles.title}>{book.title}</Text>
    <Text style={styles.author}>Autor: {book.author}</Text>
    <Text style={styles.genre}>Género: {book.genre}</Text>
    <Text style={styles.description}>{book.description}</Text>
  </View>
);

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={({ item }) => <BookItem book={item} />}
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
  list: {
    padding: 16,
  },
  bookItem: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
