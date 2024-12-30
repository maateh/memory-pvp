import type { z } from "zod"
import type { UserResource } from "@clerk/types"
import type { clientCollectionSchema, clientMemoryCardSchema } from "@/lib/schema/collection-schema"
import type { clientPlayerSchema } from "@/lib/schema/player-schema"
import type { clientSessionCardSchema, clientSessionSchema, unsignedClientSessionSchema } from "@/lib/schema/session-schema"
import type { clientUserSchema } from "@/lib/schema/user-schema"

/* User types */
export type ClerkUser = Omit<UserResource, 'username'> & { username: string }
export type ClientUser = z.infer<typeof clientUserSchema>

/* Collection types */
export type ClientMemoryCard = z.infer<typeof clientMemoryCardSchema>

export type ClientCardCollection = z.infer<typeof clientCollectionSchema>

/* Session types */
export type ClientGameSession = z.infer<typeof clientSessionSchema>

export type UnsignedClientGameSession = z.infer<typeof unsignedClientSessionSchema>

export type ClientSessionCard = z.infer<typeof clientSessionCardSchema>

/* Player types */
export type ClientPlayer = z.infer<typeof clientPlayerSchema>
