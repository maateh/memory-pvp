import type { UserResource } from "@clerk/types"

/* User types */
export type ClerkUser = Omit<UserResource, 'username'> & { username: string }
