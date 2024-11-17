import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/utils/constants";
import { checkConnectivity } from "@/utils/networkUtils";

interface Book {
  id: string;
  title: string;
  author: string;
  pages: string[];
}

interface BookContextType {
  books: Book[];
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  isLoading: boolean;
  refreshBooks: () => Promise<void>;
  error: string | null;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndStoreBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedBooks = await AsyncStorage.getItem("books");
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }

      const isConnected = await checkConnectivity();
      if (isConnected) {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (response.ok) {
          const newBooks = await response.json();
          await AsyncStorage.setItem("books", JSON.stringify(newBooks));
          setBooks(newBooks);
        } else {
          throw new Error("Error al obtener los libros del servidor");
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndStoreBooks();
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        selectedBook,
        setSelectedBook,
        isLoading,
        refreshBooks: fetchAndStoreBooks,
        error,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
}
