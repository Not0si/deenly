import { queryClient } from "@/apis/config"
import { migrateDbIfNeeded } from "@/repositories"
import { useTheme } from "@/stores/theme"
import { QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colors = useTheme((s) => s.colors)
  const isDark = useTheme((s) => s.isDark)

  const [loaded, error] = useFonts({
    Cairo: require("./../assets/fonts/cairo/Cairo-VariableFont_slnt,wght.ttf"),
    Nunito: require("./../assets/fonts/nunito/Nunito-VariableFont_wght.ttf"),
    "Nunito-Italic": require("./../assets/fonts/nunito/Nunito-Italic-VariableFont_wght.ttf"),
    Cabin: require("./../assets/fonts/cabin/Cabin-VariableFont_wdth,wght.ttf"),
    "Cabin-Italic": require("./../assets/fonts/cabin/Cabin-Italic-VariableFont_wdth,wght.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  // useEffect(() => {
  //   // Set the background color
  //   NavigationBar.setBackgroundColorAsync(colors.bg)

  //   // Set button icon colors ('dark' for dark icons on light bg, 'light' for light icons)
  //   NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark")
  // }, [])

  return (
    <SQLiteProvider databaseName='medxcore.db' onInit={migrateDbIfNeeded}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
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
            <Stack.Screen
              name='modal'
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
        </SafeAreaView>

        <StatusBar style={isDark ? "light" : "dark"} />
      </QueryClientProvider>
    </SQLiteProvider>
  )
}
