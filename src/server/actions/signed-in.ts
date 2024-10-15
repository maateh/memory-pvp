"use server"

// prisma
import type { User } from "@prisma/client"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { db } from "@/server/db"

type SignedInParams = {
  redirectToSignIn?: boolean
}

export async function signedIn({ redirectToSignIn = false }: SignedInParams = {}): Promise<User | null> {
  const { userId: clerkId } = auth()

  let user: User | null = null
  if (clerkId) {
    user = await db.user.findUnique({ where: { clerkId } })
  }

  if (!user && redirectToSignIn) {
    return auth().redirectToSignIn()
  }

  return user
}
