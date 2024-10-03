import Link from "next/link"

// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// icons
import { Home } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { ThemeToggle } from "@/components/shared"
import SelectActivePlayer from "./select-active-player"
import SetupGameForm from "./setup-game-form"

type GameSetupPageProps = {
  searchParams: {
    type: GameType
    mode: GameMode
    tableSize: TableSize
  }
}

const GameSetupPage = async ({ searchParams }: GameSetupPageProps) => {
  const user = await signedIn()

  let players: PlayerProfileWithUserAvatar[] = []
  if (user) {
    players = await db.playerProfile.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: {
          select: { imageUrl: true }
        }
      }
    })
  }

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
        expandable
      />

      <div className="w-fit mx-auto text-center">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold sm:heading-decorator sm:text-4xl max-sm:border-t-2 max-sm:border-t-accent max-sm:pt-2">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>
      </div>

      <SelectActivePlayer user={user} players={players} />

      <Separator className="w-3/5 mx-auto mt-1 mb-5 sm:w-2/5 lg:w-1/5" />

      <SetupGameForm defaultValues={searchParams} />
    </div>
  )
}

export default GameSetupPage
