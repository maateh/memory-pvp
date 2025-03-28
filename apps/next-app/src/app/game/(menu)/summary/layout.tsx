import Link from "next/link"

// icons
import { ArrowBigLeftDash } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { GlowingOverlay } from "@/components/shared"

const GameSummaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="mt-4 mb-6">
        <h1 className="w-fit mx-auto text-3xl sm:text-4xl font-heading font-bold small-caps heading-decorator">
          Session Results
        </h1>

        <Separator className="w-1/5 mx-auto mt-1 mb-4 bg-border/10" />

        <p className="-mt-3 max-w-lg mx-auto font-heading text-muted-foreground text-center text-base sm:text-xl">
          The <span className="text-accent font-medium">game is over</span>, thanks for playing!
        </p>
      </header>

      <main className="flex-1 flex flex-col mx-auto px-2.5 sm:px-4">
        {children}

        <GlowingOverlay className="w-32 sm:w-44 mt-auto mx-auto py-2.5"
          overlayProps={{ className: "bg-accent opacity-90 dark:opacity-50" }}
        >
          <Button className="z-10 relative mx-auto flex gap-x-2 rounded-full text-foreground/90 font-heading tracking-wider sm:text-base"
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/game/setup">
              <ArrowBigLeftDash className="size-5 sm:size-6 shrink-0"
                strokeWidth={1.75}
              />

              <span className="mt-1">
                New game
              </span>
            </Link>
          </Button>
        </GlowingOverlay>
      </main>
    </>
  )
}

export default GameSummaryLayout
