interface DateTimeOptions {
  timeZone?: string // e.g., 'UTC', 'America/New_York', 'Asia/Tokyo'
  locale?: string // e.g., 'en-US', 'fr-FR' (defaults to system locale)
}

type DateInput = Date | string | number | TZDateTime

export class TZDateTime {
  private readonly _date: Date
  private readonly _timeZone: string
  private readonly _locale: string

  constructor(
    dateInput: DateInput = new Date(),
    options: DateTimeOptions = {}
  ) {
    this._timeZone =
      options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
    this._locale = options.locale || "default"
    this._date = TZDateTime.parseInput(dateInput)
  }

  /**
   * Static Factory Methods
   */
  public static now(timeZone?: string, locale?: string): TZDateTime {
    return new TZDateTime(new Date(), { timeZone, locale })
  }

  public static fromISO(
    isoString: string,
    options?: DateTimeOptions
  ): TZDateTime {
    return new TZDateTime(isoString, { ...options })
  }

  public static fromDate(date: Date, options?: DateTimeOptions): TZDateTime {
    return new TZDateTime(date, { ...options })
  }

  private static parseInput(input: DateInput): Date {
    if (input instanceof TZDateTime) return input.toDate()
    if (input instanceof Date) {
      if (isNaN(input.getTime()))
        throw new Error("Invalid Date object provided.")
      return new Date(input.getTime())
    }
    const parsed = new Date(input)
    if (isNaN(parsed.getTime())) throw new Error(`Invalid date input: ${input}`)
    return parsed
  }

  /**
   * Core Getters & Conversions
   */
  public toDate(): Date {
    return new Date(this._date.getTime())
  }

  public getTime(): number {
    return this._date.getTime() // Epoch milliseconds
  }

  public getTimeZone(): string {
    return this._timeZone
  }

  /**
   * Returns a new instance converted to a different timezone
   */
  public withTimeZone(targetTimeZone: string): TZDateTime {
    return new TZDateTime(this._date, {
      timeZone: targetTimeZone,
      locale: this._locale,
    })
  }

  /**
   * Detailed breakdown of date/time components in target timezone
   */
  public toParts(): Record<string, string> {
    const formatter = new Intl.DateTimeFormat(this._locale, {
      timeZone: this._timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      fractionalSecondDigits: 3,
    })

    const parts = formatter.formatToParts(this._date)
    return parts.reduce(
      (acc, part) => {
        if (part.type !== "literal") {
          acc[part.type] = part.value
        }
        return acc
      },
      {} as Record<string, string>
    )
  }

  /**
   * Formatting Utilities
   */

  /**
   * Format using standard tokens:
   * YYYY = year, MM = month, DD = day, HH = 24h, mm = minute, ss = second, SSS = ms
   */
  public format(pattern: string): string {
    const p = this.toParts()
    return pattern
      .replace(/YYYY/g, p.year ?? "0000")
      .replace(/MM/g, p.month ?? "00")
      .replace(/DD/g, p.day ?? "00")
      .replace(/HH/g, p.hour === "24" ? "00" : (p.hour ?? "00"))
      .replace(/mm/g, p.minute ?? "00")
      .replace(/ss/g, p.second ?? "00")
      .replace(/SSS/g, p.fractionalSecond ?? "000")
  }

  /**
   * Standardized ISO 8601 string representation formatted for the target timezone
   * e.g., "2026-03-30T14:30:00.000"
   */
  public toLocalISOString(): string {
    return this.format("YYYY-MM-DDTHH:mm:ss.SSS")
  }

  /**
   * Standard UTC ISO String
   */
  public toISOString(): string {
    return this._date.toISOString()
  }

  /**
   * Native localized formatting via Intl API
   */
  public toLocalized(
    style: "full" | "long" | "medium" | "short" = "medium"
  ): string {
    const dateStyle = style
    const timeStyle = style
    return new Intl.DateTimeFormat(this._locale, {
      timeZone: this._timeZone,
      dateStyle,
      timeStyle,
    }).format(this._date)
  }
}
