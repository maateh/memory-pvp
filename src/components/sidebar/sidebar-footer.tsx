// clerk
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

// icons
import { UserRound } from "lucide-react"

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
            <Button className="rounded-2xl"
              variant="outline"
              size="icon"
            >
              <UserRound className="size-5" />
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </>
  )
}

export default SidebarFooter
