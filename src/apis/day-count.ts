import { PaginationParams } from "@/repositories"
import { dayCountRepository } from "@/repositories/day-count"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useGetDayCounts = (options: PaginationParams) => {
  const db = useSQLiteContext()

  return useQuery({
    queryKey: ["day_count", options.page, options.limit],
    queryFn: async () => {
      const paginatedData = await dayCountRepository.getDayCounts(db, {
        page: options.page,
        limit: options.limit,
      })

      return paginatedData
    },
  })
}
