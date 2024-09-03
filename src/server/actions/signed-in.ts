// prisma
import { User } from "@prisma/client"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { db } from "@/server/db"

export async function signedIn(): Promise<User | null> {
  const { userId } = auth()

  if (!userId) {
    auth().redirectToSignIn()
    return null
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId
    }
  })

  if (!user) {
    auth().redirectToSignIn()
    return null
  }

  return user
}
