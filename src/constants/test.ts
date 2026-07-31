import { ObjectEnum } from "@/utils/object-enum"

// 1. Define your interface
interface UserRole {
  id: string
  label: string
  permissions: string[]
}

// 2. Define your object instances
const ROLES_DATA = [
  {
    id: "ADMIN",
    label: "Administrator",
    permissions: ["read", "write", "delete"],
  },
  { id: "EDITOR", label: "Editor", permissions: ["read", "write"] },
  { id: "VIEWER", label: "Viewer", permissions: ["read"] },
] as const

// 3. Create the Enum instance (passing 'id' as the key field)
export const UserRoleEnum = new ObjectEnum(ROLES_DATA, "id")

// --- HOW TO USE IT ---

// 1. toList() - Get all entries (immutable)
const roles = UserRoleEnum.toList()
console.log(roles.length) // 3

const rol2es = UserRoleEnum.getValues()
// 2. parse() - Safe parsing (returns undefined if not found)
const role = UserRoleEnum.parse("ADMIN")
console.log(role?.label) // "Administrator"

const invalid = UserRoleEnum.parse("SUPER_USER") // undefined

// 3. parseOrThrow() - Strict parsing
try {
  const strictRole = UserRoleEnum.parseOrThrow("EDITOR")
  console.log(strictRole.permissions) // ['read', 'write']
} catch (e) {
  console.error(e)
}

// 4. Immutability Check (Frozen)
// role.label = 'Hacked';
// ❌ Error: Cannot assign to read only property 'label' of object
