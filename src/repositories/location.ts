import Storage from "expo-sqlite/kv-store"

import { LocationObject } from "expo-location"

const accessKey = "user_location"

export const locationRepository = {
  get: async () => {
    const value = await Storage.getItem(accessKey)

    if (!value) return null

    const entity = JSON.parse(value) as LocationObject

    return entity
  },

  set: async (location: LocationObject) => {
    await Storage.setItem(accessKey, JSON.stringify(location))
  },

  remove: async () => {
    await Storage.removeItem(accessKey)
  },
}
