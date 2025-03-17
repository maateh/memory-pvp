import type { User } from "@clerk/nextjs/server"

/* User types */
export type ClerkUser = Pick<User, "username" | "imageUrl"> & { username: string }
