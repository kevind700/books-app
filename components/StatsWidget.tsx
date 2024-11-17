import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

interface ReadingStats {
  bookId: string;
  title: string;
  timeSpent: number;
  pageStats: Array<{ page: number; time: number }>;
  currentPage: number;
}

interface StatsWidgetProps {
  refreshTrigger?: number;
  selectedBook: string | null;
}

const { width } = Dimensions.get("window");

export default function StatsWidget({
  refreshTrigger = 0,
  selectedBook,
}: StatsWidgetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(
    selectedBook,
  );
  const [items, setItems] = useState<Array<{ label: string; value: string }>>(
    [],
  );
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedBookId(selectedBook);
  }, [selectedBook]);

  useEffect(() => {
    loadBooks();
    loadStats();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedBookId) {
      loadStats();
    }
  }, [selectedBookId]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const stats = await AsyncStorage.getItem(`readingStats_${user?.id}`);
      if (stats) {
        const parsedStats = JSON.parse(stats);
        const bookItems = parsedStats.map((stat: ReadingStats) => ({
          label: stat.title,
          value: stat.bookId,
        }));
        setItems(bookItems);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const stats = await AsyncStorage.getItem(`readingStats_${user?.id}`);
      if (stats) {
        const parsedStats = JSON.parse(stats);
        const bookStats = parsedStats.find(
          (s: ReadingStats) => s.bookId === selectedBookId,
        );
        setStats(bookStats || null);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={open}
          value={selectedBookId}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedBookId}
          setItems={setItems}
          placeholder="Selecciona un libro"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          listItemContainerStyle={styles.dropdownItemContainer}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      {isLoading ? (
        <View style={styles.noStats}>
          <ActivityIndicator size="small" color="#8B4513" />
        </View>
      ) : stats ? (
        <ScrollView
          style={[styles.statsContainer, { marginTop: 10 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            <View style={[styles.statCard, styles.halfWidth]}>
              <Text style={styles.statLabel}>Tiempo Total</Text>
              <Text style={styles.statValue}>
                {formatTime(stats.timeSpent)}
              </Text>
            </View>
            <View style={[styles.statCard, styles.halfWidth]}>
              <Text style={styles.statLabel}>Promedio por Página</Text>
              <Text style={styles.statValue}>
                {formatTime(stats.timeSpent / stats.pageStats.length)}
              </Text>
            </View>
          </View>

          <View style={styles.pagesContainer}>
            <Text style={styles.sectionTitle}>Tiempo por Página</Text>
            <ScrollView
              style={styles.pagesList}
              showsVerticalScrollIndicator={false}
            >
              {stats.pageStats.map((pageStat, index) => (
                <View key={index} style={styles.pageStatItem}>
                  <Text style={styles.pageNumber}>
                    Página {pageStat.page + 1}
                  </Text>
                  <Text style={styles.pageTime}>
                    {formatTime(pageStat.time)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noStats}>
          <Text style={styles.noStatsText}>
            Selecciona un libro para ver sus estadísticas
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  dropdownWrapper: {
    zIndex: 3000,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#FFF9F0",
    borderColor: "#D4C4B7",
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#2C1810",
  },
  dropdownContainer: {
    backgroundColor: "#FFF9F0",
    borderColor: "#D4C4B7",
    borderRadius: 8,
  },
  dropdownItemContainer: {
    borderBottomColor: "#E6D5C3",
  },
  statsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  halfWidth: {
    width: (width - 30) / 2,
  },
  statCard: {
    backgroundColor: "#FFF9F0",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#2C1810",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B4F3E",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C1810",
  },
  pagesContainer: {
    backgroundColor: "#FFF9F0",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    shadowColor: "#2C1810",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C1810",
    marginBottom: 10,
  },
  pagesList: {
    maxHeight: 200,
  },
  pageStatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6D5C3",
  },
  pageNumber: {
    fontSize: 14,
    color: "#4A3427",
  },
  pageTime: {
    fontSize: 14,
    color: "#8B4513",
  },
  noStats: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noStatsText: {
    color: "#6B4F3E",
    fontSize: 16,
    textAlign: "center",
  },
});
