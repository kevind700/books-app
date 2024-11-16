import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("userToken");
      if (savedToken) {
        setToken(savedToken);
        await fetchUserData(savedToken);
      }
    } catch (error) {
      console.error("Error loading token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        headers: {
          token: userToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      await signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const newToken = data.token;

      await AsyncStorage.setItem("userToken", newToken);
      setToken(newToken);

      await fetchUserData(newToken);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const keysToRemove = ["userToken", "userData"];
      await Promise.all(
        keysToRemove.map((key) => AsyncStorage.removeItem(key)),
      );
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, setUser, setToken, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
