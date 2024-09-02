// clerk
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

// icons
import { LogIn } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { ThemeToggle } from "@/components/shared"

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
          <SignInButton>
            <Button variant="secondary" size="sm">
              <LogIn className="size-4 mr-2" />
              <span>Sign In</span>
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </>
  )
}

export default SidebarFooter
