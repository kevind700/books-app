import { Slot, useRouter, useSegments } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";

function RootLayoutNav() {
  const { token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)/library");
    }
  }, [token, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
