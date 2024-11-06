"use server"

// clerk
import { SignedIn as ClerkSignedIn } from "@clerk/nextjs"

// server
import { signedIn } from "@/server/db/signed-in"

type SignedInProps = {
  redirect?: boolean
} & React.PropsWithChildren

const SignedIn = async ({ redirect = false, children }: SignedInProps) => {
  const user = await signedIn({ redirectToSignIn: redirect })
  if (!user) return

  return (
    <ClerkSignedIn>
      {children}
    </ClerkSignedIn>
  )
}

export default SignedIn
