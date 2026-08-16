import { PaginationParams } from "@/repositories"
import { dayCountRepository } from "@/repositories/day-count"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useGetDayCounts = ({ page, limit }: PaginationParams) => {
  const db = useSQLiteContext()

  return useQuery({
    queryKey: ["day_count", page, limit],
    queryFn: async () => {
      return dayCountRepository.getDayCounts(db, { page, limit })
    },

    // Retain previous data while loading the next page to prevent UI flickers
    placeholderData: keepPreviousData,

    // Disable automatic refetching on window focus for local SQLite queries
    refetchOnWindowFocus: false,

    // Ensure query only runs if database context is ready
    enabled: Boolean(db),
  })
}
