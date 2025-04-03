import Link from "next/link"
import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"
import { SignInButton } from "@clerk/nextjs"

// icons
import { Gamepad2, LogIn } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const HomePage = async () => {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="flex flex-col items-center justify-center text-center absolute top-1/2 md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500">
      <p className="text-muted-foreground font-heading font-light text-base sm:text-xl tracking-wide small-caps">
        memory <span className="mx-0.5 text-xs sm:text-sm">/</span> pvp
      </p>

      <Separator className="h-0.5 mt-0.5 mb-6 bg-border/25 rounded-full" />

      <h1 className="font-heading font-semibold text-3xl sm:text-4xl md:text-5xl tracking-wider">
        Let&apos;s <span className="text-accent">memorize</span>!
      </h1>

      <p className="max-w-2xl mt-2 text-muted-foreground text-sm sm:text-base font-light tracking-wide">
        Low effort homepage. Please forgive me for that. But I tell you something; instead of looking this simple page, go and memorize memory cards and earn some valuable points.
      </p>

      <Separator className="w-1/3 mx-auto mt-4 mb-8 bg-border/10 rounded-full" />

      <div className="w-full flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        <SignInButton>
          <Button className="flex-1 max-w-44 flex items-center justify-center gap-x-2 rounded-2xl text-foreground"
            variant="outline"
          >
            <LogIn className="size-4 sm:size-5" strokeWidth={2.5} />

            <span className="mt-0.5 sm:text-base font-heading tracking-wide">
              Sign Up
            </span>
          </Button>
        </SignInButton>

        <Button className="flex-1 max-w-44 flex items-center justify-center gap-x-2 rounded-2xl" asChild>
          <Link href="/game/setup">
            <Gamepad2 className="size-4 sm:size-5" strokeWidth={2.5} />

            <span className="mt-0.5 sm:text-base font-heading tracking-wide">
              Let&apos;s play!
            </span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default HomePage
