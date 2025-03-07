import { Suspense } from "react"

// icons
import { Loader2 } from "lucide-react"

// components
import { SignUp } from "@clerk/nextjs"

const SignUpPage = () => {
  return (
    <Suspense fallback={<Loader2 className="size-10 text-muted-foreground animate-spin" />}>
      <SignUp />
    </Suspense>
  )
}

export default SignUpPage
