// clerk
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton, ThemeToggle } from "@/components/shared"

const SidebarFooter = () => {
  return (
    <>
      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <ThemeToggle />

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
