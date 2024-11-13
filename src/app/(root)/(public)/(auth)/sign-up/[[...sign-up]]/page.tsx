import { Suspense } from "react"

// icons
import { Loader2 } from "lucide-react"

// components
import { SignUp } from "@clerk/nextjs"
import SidebarCollapse from "@/app/(root)/(public)/(auth)/sidebar-collapse"

const SignUpPage = () => {
  return (
    <Suspense fallback={<Loader2 className="size-10 text-muted-foreground animate-spin" />}>
      <SignUp />
      <SidebarCollapse />
    </Suspense>
  )
}

export default SignUpPage
