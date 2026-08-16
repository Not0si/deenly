import { Tabs } from "expo-router"

import { TabBarCustom } from "@/components/elements/global/tab-bar-custom"
import { useTheme } from "@/stores/theme"

export default function TabLayout() {
  const colors = useTheme((s) => s.colors)

  return (
    <Tabs
      tabBar={(props) => <TabBarCustom {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name='salat'
        options={{
          title: "Salat 1",
        }}
      />
      <Tabs.Screen
        name='counter'
        options={{
          title: "Counter 1",
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: "Explore 1",
        }}
      />
    </Tabs>
  )
}
