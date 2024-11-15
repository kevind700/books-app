import { Stack } from "expo-router";

export default function LibraryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Librería",
          headerTitle: "Mi Librería",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
          headerTitle: "Detalles del libro",
        }}
      />
    </Stack>
  );
}
