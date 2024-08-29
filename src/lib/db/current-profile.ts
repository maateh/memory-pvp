// clerk
import { auth, currentUser } from "@clerk/nextjs/server"

// prisma
import { Profile } from "@prisma/client"

// lib
import { db } from "@/lib/db"
import { handleError } from "@/lib/utils"

export async function currentProfile({ initProfile = false } = {}): Promise<Profile> {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return auth().redirectToSignIn()
    }

    let profile = await db.profile.findUnique({
      where: {
        clerkId: clerkUser.id
      }
    })

    if (!profile && process.env.NODE_ENV === 'development' && initProfile) {
      profile = await initialProfile()
    }
    
    if (!profile) {
      throw new Error('Profile not found')
    }

    return profile
  } catch (err) {
    throw handleError(err)
  }
}

// NOTE: In production, a clerk webhook is 
// going to add the user data to the database.
async function initialProfile(): Promise<Profile | null> {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return auth().redirectToSignIn()
    }
  
    const profile = await db.profile.findUnique({
      where: {
        clerkId: clerkUser.id
      }
    })
  
    if (profile) return profile
  
    const newProfile = await db.profile.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl
      }
    })
  
    return newProfile
  } catch (err) {
    throw handleError(err)
  }
}
