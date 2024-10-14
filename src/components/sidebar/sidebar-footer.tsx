import dynamic from "next/dynamic"

// clerk
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton } from "@/components/shared"
const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), { ssr: false })

const SidebarFooter = () => {
  return (
    <>
      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <ThemeToggle expandable="right" />

        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </>
  )
}

export default SidebarFooter
