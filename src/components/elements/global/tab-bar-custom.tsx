import React, { useEffect, useState } from "react"
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import { useLocale } from "@/stores/locale"
import { useTheme } from "@/stores/theme"

import { DifyOutlined, Home2Outlined } from "@lineiconshq/free-icons"
import { Lineicons } from "@lineiconshq/react-native-lineicons"

export function TabBarCustom({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colors = useTheme((s) => s.colors)
  const dir = useLocale((s) => s.dir)

  const [layouts, setLayouts] = useState<
    Record<number, { x: number; width: number }>
  >({})

  const translateX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)

  useEffect(() => {
    const layout = layouts[state.index]
    if (!layout) return

    translateX.value = withTiming(layout.x, {
      duration: 100,
      easing: Easing.ease,
    })

    indicatorWidth.value = withTiming(layout.width, {
      duration: 100,
      easing: Easing.ease,
    })
  }, [state.index, layouts])

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <View style={{ position: "absolute", bottom: 0, alignSelf: "center" }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.bg_canvas,
            flexDirection: dir === "rtl" ? "row-reverse" : "row",
          },
        ]}
      >
        {/* Indicator */}
        <Animated.View
          pointerEvents='none'
          style={[
            styles.indicator,
            { backgroundColor: colors.bg_surface },
            indicatorStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]

          const label = (options.tabBarLabel ??
            options.title ??
            route.name) as string

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TabButton
              key={route.key}
              label={label}
              routeName={route.name}
              isFocused={isFocused}
              dir={dir}
              onPress={onPress}
              onLayout={(e: LayoutChangeEvent) => {
                const { x, width } = e.nativeEvent.layout
                setLayouts((prev) => ({
                  ...prev,
                  [index]: { x, width },
                }))
              }}
            />
          )
        })}
      </View>
    </View>
  )
}

/* ---------------- TAB ---------------- */

function TabButton({
  label,
  routeName,
  isFocused,
  dir,
  onPress,
  onLayout,
}: {
  label: string
  routeName: string
  isFocused: boolean
  dir: "ltr" | "rtl"
  onPress: () => void
  onLayout: (e: LayoutChangeEvent) => void
}) {
  return (
    <TouchableOpacity
      onLayout={onLayout}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.tab,
        {
          flexDirection: dir === "rtl" ? "row-reverse" : "row",
        },
      ]}
    >
      <RouteIcon name={routeName} isFocused={isFocused} />

      {isFocused && (
        <Text style={{ color: "#fff", fontWeight: "600", marginHorizontal: 6 }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

/* ---------------- ICON ---------------- */

function RouteIcon({ name, isFocused }: { name: string; isFocused: boolean }) {
  const colors = useTheme((s) => s.colors)

  const props = {
    size: 28,
    strokeWidth: 2,
    color: isFocused ? colors.accent : colors.icon,
  }

  switch (name) {
    case "counter":
      return <Lineicons icon={DifyOutlined} {...props} />

    default:
      return <Lineicons icon={Home2Outlined} {...props} />
  }
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  indicator: {
    position: "absolute",
    left: 0,
    top: 10,
    height: 40,
    borderRadius: 42,
  },

  tab: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
})
