import { Suspense } from "react"

// icons
import { Loader2 } from "lucide-react"

// components
import { SignIn } from "@clerk/nextjs"
import SidebarCollapse from "@/app/(root)/(public)/(auth)/sidebar-collapse"

const SignInPage = () => {
  return (
    <Suspense fallback={<Loader2 className="size-10 text-muted-foreground animate-spin" />}>
      <SignIn />
      <SidebarCollapse />
    </Suspense>
  )
}

export default SignInPage
