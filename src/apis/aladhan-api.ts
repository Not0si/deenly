import {
  ILatitudeAdjustmentMethod,
  IPrayerCalculationMethod,
} from "@/constants/athan"

import { IPrayerTime, PrayerTimesSchema } from "@/schemas/athan"
import { useQuery } from "@tanstack/react-query"
import { aladhanApi, buildSearchParams } from "./config"

type IAladhanResponse<T> = {
  code: number
  status: string
  data: T
}

type IOptions = {
  latitude: string | undefined
  longitude: string | undefined
  method?: IPrayerCalculationMethod
  latitudeAdjustmentMethod?: ILatitudeAdjustmentMethod
}

export const useGetPrayerTimes = (
  year: number,
  month: number,
  options: IOptions
) => {
  const params = buildSearchParams({
    ...options,
    school: 0,
    midnightMode: 1,
    calendarMethod: "UAQ",
    timezonestring: "UTC",
    iso8601: true,
    shafaq: "general",
  })

  return useQuery({
    queryKey: ["prayer_times"],
    queryFn: async () => {
      const { data } = await aladhanApi.get<IAladhanResponse<IPrayerTime[]>>(
        `/calendar/${year}/${month}?${params}`
      )

      const parseResult = PrayerTimesSchema.safeParse(data.data)

      if (!parseResult.success) {
        throw new Error("Faild to parse data")
      }

      return mapToObj(parseResult.data)
    },
    enabled: !!year && !!month && !!options.latitude && !!options.longitude,
  })
}

const mapToObj = (data: IPrayerTime[]): Record<string, IPrayerTime> => {
  const entries = data.map((item) => {
    return [item.date.gregorian.date, item]
  })

  return Object.fromEntries(entries)
}
