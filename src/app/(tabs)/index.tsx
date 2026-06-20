import { useGetPrayerTimes } from "@/apis/aladhan-api"
import { Div } from "@/components/ui/div"
import { Message } from "@/components/ui/message"
import { useLocation } from "@/hooks/use-location"
import { getDateKey } from "@/utils/datetime"
import { Pressable } from "react-native"

export default function HomeScreen() {
  const {
    isLoading,
    location,
    isPermissionDenied,
    getCurrentLocation,
    clearLocation,
  } = useLocation()

  const { data } = useGetPrayerTimes(2026, 6, {
    latitude: location?.coords.latitude.toString(),
    longitude: location?.coords.longitude.toString(),
    method: 3,
  })

  const todayKey = getDateKey(new Date())
  const todayValue = data?.[todayKey]

  if (todayValue) {
    return (
      <Div>
        <Message>{todayValue.timings.Fajr}</Message>
        <Message>{todayValue.timings.Dhuhr}</Message>
        <Message>{todayValue.timings.Asr}</Message>
        <Message>{todayValue.timings.Maghrib}</Message>
        <Message>{todayValue.timings.Isha}</Message>
        <Message>{todayValue.timings.Firstthird}</Message>
        <Message>{todayValue.timings.Midnight}</Message>
        <Message>{todayValue.timings.Lastthird}</Message>
      </Div>
    )
  }

  if (isLoading) {
    return (
      <Div>
        <Message>Loading...</Message>
      </Div>
    )
  }

  if (isPermissionDenied) {
    return (
      <Div>
        <Message>Access to location denied</Message>
      </Div>
    )
  }

  if (!isLoading && !location) {
    return (
      <Div>
        <Message>No Location Found</Message>
        <Pressable onPress={getCurrentLocation}>
          <Message>get Location</Message>
        </Pressable>
      </Div>
    )
  }

  return (
    <Div>
      <Message>Step 1: Try it</Message>
      <Message>{location?.coords.latitude}</Message>
      <Message>{location?.coords.longitude}</Message>
      <Pressable onPress={clearLocation}>
        <Message>clear Location</Message>
      </Pressable>
    </Div>
  )
}
