export function generateUUIDv7() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Timestamp in milliseconds
  const now = Date.now()

  // 48-bit timestamp
  bytes[0] = (now / 0x10000000000) & 0xff
  bytes[1] = (now / 0x100000000) & 0xff
  bytes[2] = (now / 0x1000000) & 0xff
  bytes[3] = (now / 0x10000) & 0xff
  bytes[4] = (now / 0x100) & 0xff
  bytes[5] = now & 0xff

  // Version 7 (0b0111) in bits 48-51
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  // Variant 1 (0b10) in bits 64-65
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return [...bytes]
    .map((b, i) =>
      [4, 6, 8, 10].includes(i)
        ? `-${b.toString(16).padStart(2, "0")}`
        : b.toString(16).padStart(2, "0")
    )
    .join("")
}
