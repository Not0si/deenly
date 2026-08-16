import { useTheme } from "@/stores/theme"
import { Stack } from "expo-router"
import "react-native-reanimated"

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
        name='(tabs)'
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.bg,
            flex: 1,
          },
        }}
      />
    </Stack>
  )
}
