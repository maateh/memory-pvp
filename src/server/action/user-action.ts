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

// TODO: this can be moved back to `/db/queries` after removing trpc completely
/**
 * Checks if the current user is signed in and retrieves their user details from the database.
 * 
 * - If the user is signed in, it fetches the user data from the database using the Clerk user ID.
 * - If the user is not found and the `redirectToSignIn` flag is true, it redirects the user to the sign-in page.
 * 
 * @param {Object} [params] - Optional parameters.
 * @param {boolean} [params.redirectToSignIn=false] - Whether to redirect the user to the sign-in page if they are not authenticated.
 * 
 * @returns {Promise<User | null>} - The user object if authenticated and found in the database, or `null` otherwise.
 */
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