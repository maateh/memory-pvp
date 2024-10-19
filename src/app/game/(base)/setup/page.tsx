// prisma
import type { GameMode, GameType, TableSize } from "@prisma/client"

// server
import { signedIn } from "@/server/actions/signed-in"
import { getPlayers } from "@/server/actions/player"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import ActivePlayer from "./active-player"
import SetupGameForm from "./setup-game-form"

type BaseGameSetupPageProps = {
  searchParams: {
    type: GameType
    mode: GameMode
    tableSize: TableSize
  }
}

const BaseGameSetupPage = async ({ searchParams }: BaseGameSetupPageProps) => {
  const user = await signedIn()
  const players = await getPlayers(true)

  return (
    <>
      <header className="text-center space-y-2">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold heading-decorator sm:text-4xl">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>

        <ActivePlayer
          user={user}
          players={players}
        />
      </header>

      <Separator className="w-2/5 bg-border/60 mx-auto my-5 sm:w-1/5 lg:w-1/6" />

      <main className="flex-1 flex flex-col">
        <SetupGameForm defaultValues={searchParams} />
      </main>
    </>
  )
}

export default BaseGameSetupPage
