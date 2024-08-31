"use server"

// clerk
import { currentUser as currentClerkUser, User as ClerkUser } from "@clerk/nextjs/server"

// prisma
import { User } from "@prisma/client"

// lib
import { db } from "@/server/db"

export async function currentUser(): Promise<User | null> {
  try {
    const clerkUser = await currentClerkUser()

    if (!clerkUser) {
      throw new Error('Unauthorized')
    }

    let user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id
      }
    })

    if (!user && process.env.NODE_ENV === 'development') {
      user = await initialUser(clerkUser)
    }
    
    if (!user) {
      throw new Error('Profile not found')
    }

    return user
  } catch (err) {
    return null
  }
}

// NOTE: In production, a clerk webhook is 
// going to add the user data to the database.
async function initialUser(user: ClerkUser): Promise<User | null> {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try { 
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        username: user.username!,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl
      }
    })
  
    return newUser
  } catch (err) {
    return null
  }
}
