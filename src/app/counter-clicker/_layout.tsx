import { useTheme } from "@/stores/theme"
import { Stack } from "expo-router"

export default function Layout() {
  const colors = useTheme((s) => s.colors)

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: false, // Hides native header since HomeScreen renders its own custom header
        }}
      />
    </Stack>
  )
}
