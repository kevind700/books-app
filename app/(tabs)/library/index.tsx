import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  completed?: boolean;
  inProgress?: boolean;
  totalReadingTime?: number;
  averagePageTime?: number;
  pageReadingTimes?: number[];
  totalPages?: number;
  pages: string[];
}

export const books: Book[] = [
  {
    id: "1",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    genre: "Realismo mágico",
    description:
      "Historia de la familia Buendía a lo largo de siete generaciones en Macondo.",
    completed: false,
    inProgress: true,
    totalReadingTime: 0,
    averagePageTime: 0,
    pageReadingTimes: [],
    pages: [
      "Capítulo 1: Muchos años después, frente al pelotón de fusilamiento...",
      "Capítulo 2: Cuando José Arcadio Buendía se dio cuenta que la peste del insomnio...",
      "Capítulo 3: Úrsula no se dio por vencida...",
    ],
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genre: "Ficción distópica",
    description:
      "Una sociedad totalitaria donde el gobierno mantiene el poder mediante el control de la información.",
    completed: false,
    inProgress: false,
    totalReadingTime: 0,
    averagePageTime: 0,
    pageReadingTimes: [],
    pages: [
      "Capítulo 1: Era un día luminoso y frío de abril...",
      "Capítulo 2: Winston se dirigió hacia las escaleras...",
      "Capítulo 3: La verdad, pensó Winston, es un concepto muy peculiar...",
    ],
  },
];

const StatsWidget = () => {
  const totalBooks = books.length;
  const inProgress = books.filter((book) => book.inProgress).length;
  const completed = books.filter((book) => book.completed).length;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  };

  const totalReadingTime = books.reduce(
    (acc, book) => acc + (book.totalReadingTime || 0),
    0,
  );
  const averageReadingTime = totalReadingTime / (completed || 1);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{formatTime(totalReadingTime)}</Text>
        <Text style={styles.statLabel}>Tiempo total</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{inProgress}</Text>
        <Text style={styles.statLabel}>En progreso</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{formatTime(averageReadingTime)}</Text>
        <Text style={styles.statLabel}>Promedio/libro</Text>
      </View>
    </View>
  );
};

const BookItem = ({ book, onPress }: { book: Book; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.bookItem}>
    <Text style={styles.title}>{book.title}</Text>
    <Text style={styles.author}>Autor: {book.author}</Text>
    <Text style={styles.genre}>Género: {book.genre}</Text>
    <Text numberOfLines={2} style={styles.description}>
      {book.description}
    </Text>
    {book.completed && (
      <View style={styles.readingStats}>
        <Text style={styles.statText}>
          Tiempo total: {Math.floor(book.totalReadingTime! / 60000)} min
        </Text>
        <Text style={styles.statText}>
          Promedio por página: {Math.floor(book.averagePageTime! / 1000)} seg
        </Text>
      </View>
    )}
  </Pressable>
);

export default function LibraryScreen() {
  const router = useRouter();

  const handleBookPress = (bookId: string) => {
    router.push(`/library/${bookId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={<StatsWidget />}
        data={books}
        renderItem={({ item }) => (
          <BookItem book={item} onPress={() => handleBookPress(item.id)} />
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
  list: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
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
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#ddd",
    alignSelf: "center",
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
  readingStats: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
  },
});
