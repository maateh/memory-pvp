import Link from "next/link"

// prisma
import { GameMode } from "@prisma/client"

// constants
import { gamemodes, tableSizes } from "@/constants/navigation"

// utils
import { cn } from "@/lib/utils"

// icons
import { CirclePlay, LayoutDashboard } from "lucide-react"

// shadcn
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type GameSetupPageProps = {
  searchParams: {
    mode: 'single' | 'pvp' | 'coop'
  }
}

const GameSetupPage = ({ searchParams }: GameSetupPageProps) => {
  return (
    <div className="flex-1 pt-16 pb-8 px-4 flex flex-col gap-y-3">
      <div className="w-fit mx-auto text-center">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold sm:heading-decorator sm:text-4xl max-sm:border-t-2 max-sm:border-t-accent max-sm:pt-2">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>
      </div>

      <Separator className="w-3/5 mx-auto my-6 sm:w-2/5 lg:w-1/5" />

      <div className="space-y-2 text-center">
        <h2 className="text-lg font-heading font-semibold small-caps sm:text-xl">
          Select Gamemode
        </h2>

        <div className="max-w-sm mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2">
          {gamemodes.map(({ key, label, Icon }) => (
            <Button className="p-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl sm:last-of-type:col-span-2"
              variant="default"
              size="icon"
              disabled={key !== GameMode.SINGLE}
              key={key}
            >
              <Icon className="size-4 sm:size-5 shrink-0" />
              <p className="text-base sm:text-lg small-caps">
                {label}
              </p>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-2 text-center sm:mt-8">
        <h2 className="text-lg font-heading font-semibold small-caps sm:text-xl">
          Table Size
        </h2>

        <div className="max-w-sm mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2">
          {tableSizes.map(({ key, label, Icon }) => (
            <Button className="p-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/15 rounded-2xl sm:last-of-type:col-span-2"
              variant="default"
              size="icon"
              key={key}
            >
              <Icon className="size-4 sm:size-5 shrink-0" />
              <p className="text-base sm:text-lg small-caps">
                {label}
              </p>
            </Button>
          ))}
        </div>
      </div>


      <div className="mt-auto flex flex-col items-center gap-y-4">
        <Button className="py-6 px-4 gap-x-2 text-base sm:text-lg"
          variant="secondary"
          // TODO: onClick={startGame}
        >
          <CirclePlay className="size-5 sm:size-6 shrink-0" />
          Start new game
        </Button>

        <Link className={cn(buttonVariants({
          className: "gap-x-2 text-sm sm:text-base",
          variant: "destructive"
        }))}
          href="/"
        >
          <LayoutDashboard className="size-5 sm:size-6 shrink-0" />
          Go back
        </Link>
      </div>
    </div>
  )
}

export default GameSetupPage
