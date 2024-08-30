"use server"

// clerk
import { currentUser, User } from "@clerk/nextjs/server"

// prisma
import { Profile } from "@prisma/client"

// lib
import { db } from "@/server/db"

export async function currentProfile(): Promise<Profile | null> {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    let profile = await db.profile.findUnique({
      where: {
        clerkId: user.id
      }
    })

    if (!profile && process.env.NODE_ENV === 'development') {
      profile = await initialProfile(user)
    }
    
    if (!profile) {
      throw new Error('Profile not found')
    }

    return profile
  } catch (err) {
    return null
  }
}

// NOTE: In production, a clerk webhook is 
// going to add the user data to the database.
async function initialProfile(user: User): Promise<Profile | null> {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try { 
    const newProfile = await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl
      }
    })
  
    return newProfile
  } catch (err) {
    return null
  }
}
