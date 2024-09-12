// prisma
import { User } from "@prisma/client"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { db } from "@/server/db"

export async function signedIn({ redirect = false }: { redirect?: boolean } = {}): Promise<User | null> {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    return redirect ? auth().redirectToSignIn() : null
  }

  const user = await db.user.findUnique({ where: { clerkId } })

  if (!user) {
    return redirect ? auth().redirectToSignIn() : null
  }

  return user
}
