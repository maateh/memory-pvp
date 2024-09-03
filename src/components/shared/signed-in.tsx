"use server"

// clerk
import { SignedIn as ClerkSignedIn } from "@clerk/nextjs"

// actions
import { signedIn } from "@/server/actions/signed-in"

const SignedIn = async ({ children }: React.PropsWithChildren) => {
  const user = await signedIn()
  
  if (!user) return

  return (
    <ClerkSignedIn>
      {user && children}
    </ClerkSignedIn>
  )
}

export default SignedIn
