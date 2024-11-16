import AsyncStorage from "@react-native-async-storage/async-storage";

interface PageStat {
  page: number;
  time: number;
}

interface ReadingStats {
  bookId: string;
  title: string;
  timeSpent: number;
  pageStats: PageStat[];
  currentPage: number;
}

export async function getBookStats(
  userId: string,
  bookId: string,
): Promise<ReadingStats | null> {
  try {
    const stats = await getReadingStats(userId);
    return stats.find((s) => s.bookId === bookId) || null;
  } catch (error) {
    console.error("Error getting book stats:", error);
    return null;
  }
}

export async function getReadingStats(userId: string): Promise<ReadingStats[]> {
  try {
    const stats = await AsyncStorage.getItem(`readingStats_${userId}`);
    return stats ? JSON.parse(stats) : [];
  } catch (error) {
    console.error("Error getting reading stats:", error);
    return [];
  }
}

export async function updateReadingStats(
  userId: string,
  bookId: string,
  title: string,
  page: number,
  timeSpent: number,
) {
  try {
    const stats = await getReadingStats(userId);
    const bookStats = stats.find((s) => s.bookId === bookId);

    if (bookStats) {
      const pageStatIndex = bookStats.pageStats.findIndex(
        (p) => p.page === page,
      );
      if (pageStatIndex >= 0) {
        bookStats.pageStats[pageStatIndex].time += timeSpent;
      } else {
        bookStats.pageStats.push({ page, time: timeSpent });
      }
      bookStats.timeSpent += timeSpent;
      bookStats.currentPage = page;
    } else {
      stats.push({
        bookId,
        title,
        timeSpent,
        pageStats: [{ page, time: timeSpent }],
        currentPage: page,
      });
    }

    await AsyncStorage.setItem(`readingStats_${userId}`, JSON.stringify(stats));
  } catch (error) {
    console.error("Error updating reading stats:", error);
  }
}
