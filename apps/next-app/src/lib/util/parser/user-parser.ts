// types
import type { ClientUser } from "@repo/schema/user"

/* Schema parser keys */
export const clientUserKeys: (keyof ClientUser)[] = [
  'username', 'imageUrl', 'createdAt', 'updatedAt'
] as const
