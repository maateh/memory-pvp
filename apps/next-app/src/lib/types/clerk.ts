import type { UserResource } from "@clerk/types"

/* User types */
export type ClerkUser = Pick<UserResource, "username" | "imageUrl"> & { username: string }
