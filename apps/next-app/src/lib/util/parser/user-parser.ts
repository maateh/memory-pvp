// types
import type { ClientUser } from "@/lib/types/client"

/* Schema parser keys */
export const clientUserKeys: (keyof ClientUser)[] = [
  'username', 'imageUrl', 'createdAt', 'updatedAt'
] as const
