//========================================
//
//
//========================================

export const latitudeAdjustmentMethod = {
  MiddleOfTheNight: {
    value: 1,
    description: "Middle of the Night",
  },
  OneSeventh: {
    value: 2,
    description: "One Seventh",
  },
  AngleBased: {
    value: 3,
    description: "Angle Based",
  },
} as const

export type ILatitudeAdjustmentMethod =
  (typeof latitudeAdjustmentMethod)[keyof typeof latitudeAdjustmentMethod]["value"]

//========================================
//
//
//========================================

export const prayerCalculationMethod = {
  Jafari: {
    value: 0,
    description: "Jafari / Shia Ithna-Ashari",
  },
  UIS: {
    value: 1,
    description: "University of Islamic Sciences, Karachi",
  },
  ISNA: {
    value: 2,
    description: "Islamic Society of North America",
  },
  MWL: {
    value: 3,
    description: "Muslim World League",
  },
  UAQU: {
    value: 4,
    description: "Umm Al-Qura University, Makkah",
  },
  Egypte: {
    value: 5,
    description: "Egyptian General Authority of Survey",
  },
  Morocco: {
    value: 21,
    description: "Morocco",
  },
} as const

export type IPrayerCalculationMethod =
  (typeof prayerCalculationMethod)[keyof typeof prayerCalculationMethod]["value"]
