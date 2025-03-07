// types
import type { ClientUser } from "@/lib/schema/user-schema"

/* Schema parser keys */
export const clientUserKeys: (keyof ClientUser)[] = [
  'username', 'imageUrl', 'createdAt', 'updatedAt'
] as const
