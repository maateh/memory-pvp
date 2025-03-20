import Link from "next/link"

// icons
import { Cog } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const GameSummaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="mt-4">
        <h1 className="pt-1 w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Session Results
        </h1>

        <Separator className="w-3/4 mx-auto mt-4 mb-6 bg-border/40" />

        <p className="-mt-3 max-w-lg mx-auto text-center font-heading text-base sm:text-xl">
          Your <span className="text-accent font-medium">game is over</span>, thanks for playing!
        </p>

        <Button className="w-fit mt-2 mx-auto flex gap-x-2 border-border/40 hover font-heading tracking-wider hover:bg-accent/15 dark:hover:bg-accent/10 hover:text-foreground"
          variant="outline"
          size="sm"
          asChild
        >
          <Link href="/game/setup">
            <Cog className="size-4 sm:size-5 shrink-0"
              strokeWidth={1.75}
            />

            <span className="mt-1">
              New game
            </span>
          </Link>
        </Button>
      </header>

      <Separator className="w-3/5 mx-auto mt-4 mb-6 bg-border/5" />

      <main className="flex-1 mx-auto px-2.5 sm:px-4">
        {children}
      </main>
    </>
  )
}

export default GameSummaryLayout
