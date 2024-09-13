// prisma
import type { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton, Warning } from "@/components/shared"
import SaveGameResults from "./save-game-results"

const GameOfflineSummaryPage = async () => {
  const user = await signedIn()

  let players: PlayerProfile[] = []
  if (user) {
    players = await db.playerProfile.findMany({
      where: {
        userId: user.id
      }
    })
  }

  return (
    <div className="flex-1 px-2.5 space-y-16 sm:px-4">
      <section className="mt-24 space-y-3">
        <h1 className="w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Game over!
        </h1>

        <Separator className="w-5/6 mx-auto border-foreground/50" />

        <p className="max-w-lg mx-auto text-center font-heading text-base sm:text-lg">
          You&apos;re game is over, thanks for playing!
        </p>
      </section>

      {/* TODO: show results here */}
      {/* <GameResultsSummary /> */}

      {!user ? (
        <div className="flex flex-col items-center gap-y-4">
          <Warning className="font-body font-light tracking-wide sm:text-base"
            iconProps={{ className: "sm:size-6" }}
            message="Please, sign in first to save your game results."
          />

          <SignInButton className="h-10 bg-destructive/75 sm:text-base"
            iconProps={{ className: "sm:size-5" }}
            variant="destructive"
            size="default"
          />
        </div>
      ) : (
        <SaveGameResults players={players} />
      )}
    </div>
  )
}

export default GameOfflineSummaryPage
