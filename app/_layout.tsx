import { Slot, useRouter, useSegments, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { BookProvider } from "../context/BookContext";
import { SplashScreen } from "expo-router";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();

  const handleNavigate = useCallback(async () => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      await router.replace("/(auth)");
    } else if (token && inAuthGroup) {
      await router.replace("/(tabs)/library");
    }

    await SplashScreen.hideAsync();
  }, [isLoading, segments, token]);

  useEffect(() => {
    handleNavigate();
  }, [handleNavigate]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <BookProvider>
        <RootLayoutNav />
      </BookProvider>
    </AuthProvider>
  );
}
