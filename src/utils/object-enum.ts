import { z } from "zod"

/**
 * A strongly-typed utility class for representing enum-like collections of objects
 * with fast lookup capabilities by a designated key field.
 *
 * @template T The object shape containing the enum item metadata.
 * @template Key The key of `T` used as the primary identifier/enum key.
 */
export class ObjectEnum<
  const T extends Record<string, any>,
  const Key extends keyof T,
> {
  private readonly _items: readonly T[]
  private readonly _byKey: Map<T[Key], T>
  private readonly _keyField: Key

  /**
   * Creates an instance of `ObjectEnum`.
   * Deep-freezes (shallowly freezes individual items and list) the provided items
   * and builds an internal index map for fast key lookups.
   *
   * @param items The list of object items defining the enum.
   * @param keyField The field name in `T` to use as the lookup key.
   */
  constructor(items: readonly T[], keyField: Key) {
    this._keyField = keyField
    this._items = Object.freeze(items.map((item) => Object.freeze({ ...item })))

    this._byKey = new Map<T[Key], T>()
    for (const item of this._items) {
      this._byKey.set(item[keyField], item)
    }
  }

  /**
   * Gets a frozen array of all distinct key values typed as literal union types.
   */
  get values(): readonly T[Key][] {
    return Array.from(this._byKey.keys())
  }

  /**
   * Alias for the `values` getter. Returns an array of all key values.
   *
   * @returns An array of key values.
   */
  getValues(): readonly T[Key][] {
    return this.values
  }

  /**
   * Returns a frozen list containing all full object items in the enum.
   *
   * @returns An array of all enum items (`T`).
   */
  toList(): readonly T[] {
    return this._items
  }

  /**
   * Attempts to resolve an unknown value (either a key or an object reference)
   * to a valid enum object.
   *
   * @param value The value or key to parse.
   * @returns The matching enum object `T` if found, or `undefined`.
   */
  parse(value: unknown): T | undefined {
    if (typeof value === "object" && value !== null) {
      return this._items.find((item) => item === value)
    }
    return this._byKey.get(value as T[Key])
  }

  /**
   * Parses an unknown value to an enum item, throwing an error if unresolved.
   *
   * @param value The value or key to parse.
   * @param message Optional custom error message if parsing fails.
   * @returns The matching enum object `T`.
   * @throws {Error} If no matching item is found.
   */
  parseOrThrow(value: unknown, message?: string): T {
    const found = this.parse(value)
    if (!found) {
      throw new Error(message ?? `Invalid enum value: ${String(value)}`)
    }
    return found
  }

  /**
   * Compares two entities (which can be keys or full enum objects) for key equality.
   *
   * @param target The target value or key to check.
   * @param compareTo The enum object or key value to compare against.
   * @returns `true` if target and compareTo resolve to the same key value, `false` otherwise.
   */
  isEqual(target: unknown, compareTo: T | T[Key]): boolean {
    if (!target) return false

    const targetKey =
      typeof target === "object" && target !== null
        ? (target as any)[this._keyField]
        : target

    const compareKey =
      typeof compareTo === "object" && compareTo !== null
        ? (compareTo as T)[this._keyField]
        : compareTo

    return targetKey === compareKey
  }

  /**
   * Checks whether a key exists in the enum.
   *
   * @param value The key to test.
   * @returns `true` if the key exists in the enum map, `false` otherwise.
   */
  has(value: unknown): boolean {
    return this._byKey.has(value as T[Key])
  }

  /**
   * Generates a Zod enum schema for validating string keys against this enum.
   *
   * @param params Optional custom error message or error map function.
   * @returns A `z.ZodEnum` schema matching the allowed key values.
   */
  toZodSchema(params?: Parameters<typeof z.enum>[1]) {
    const stringKeys = this.values.map(String) as [string, ...string[]]
    if (stringKeys.length === 0) {
      throw new Error(
        "Cannot create a Zod enum schema from an empty ObjectEnum."
      )
    }
    return z.enum(stringKeys, params)
  }

  /**
   * Generates a Zod schema that transforms string/object inputs into full enum objects (`T`).
   *
   * @param message Optional custom error message if parsing fails.
   * @returns A Zod effect schema that outputs the full enum object `T`.
   */
  toZodTransformSchema(message?: string) {
    return z.unknown().transform((val, ctx) => {
      const parsed = this.parse(val)
      if (!parsed) {
        ctx.addIssue({
          code: "custom",
          message: message ?? `Invalid enum value: ${String(val)}`,
        })
        return z.NEVER
      }
      return parsed
    })
  }
}
