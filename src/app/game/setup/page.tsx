import Link from "next/link"

// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

// trpc
import { api } from "@/trpc/server"

// icons
import { Home } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { StartGameForm } from "@/components/form"
import { PlayerWithAvatar } from "@/components/player"
import { ThemeToggle } from "@/components/shared"

type GameSetupPageProps = {
  searchParams: {
    type: GameType
    mode: GameMode
    tableSize: TableSize
  }
}

const GameSetupPage = async ({ searchParams }: GameSetupPageProps) => {
  const player = await api.playerProfile.getActive()

  return (
    <div className="relative flex-1 pt-16 pb-8 px-4 flex flex-col gap-y-3">
      <Link className={buttonVariants({
        className: "bg-destructive/85 rounded-2xl expandable absolute top-3 left-3 sm:top-4 sm:left-4",
        variant: "destructive",
        size: "icon"
      })}
        href="/"
      >
        <Home className="size-4 sm:size-5 shrink-0" />
        <div className="ml-1 sm:ml-1.5">
          Homepage
        </div>
      </Link>

      <ThemeToggle className="p-2 bg-accent/30 absolute top-3 right-3 sm:top-4 sm:right-4"
        variant="ghost"
      />

      <div className="w-fit mx-auto text-center">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold sm:heading-decorator sm:text-4xl max-sm:border-t-2 max-sm:border-t-accent max-sm:pt-2">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>
      </div>

      <PlayerWithAvatar className="mt-2 mx-auto"
        playerBadgeProps={{ className: "sm:text-base" }}
        imageUrl={player.user.imageUrl}
        imageSize={32}
        player={player}
      />

      <Separator className="w-3/5 mx-auto mt-1 mb-5 sm:w-2/5 lg:w-1/5" />

      <StartGameForm defaultValues={searchParams} />
    </div>
  )
}

export default GameSetupPage
