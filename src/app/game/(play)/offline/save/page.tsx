import dynamic from "next/dynamic"

// prisma
import type { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton, Warning } from "@/components/shared"
import SaveOfflineGame from "./save-offline-game"
const OfflineSessionResults = dynamic(() => import('./offline-session-results'), { ssr: false })

const GameOfflineSavePage = async () => {
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
    <main className="flex-1 px-2.5 sm:px-4">
      <header className="mt-24 mb-12">
        <h1 className="w-fit pt-1.5 mx-auto text-center text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Save Offline Session
        </h1>

        <Separator className="w-5/6 mx-auto my-3" />

        <p className="max-w-lg mx-auto text-center font-heading text-base sm:text-lg">
          Your game is over, thanks for playing!
        </p>
      </header>

      <OfflineSessionResults />

      <Separator className="w-1/5 mx-auto mt-4 mb-10 bg-foreground/5" />

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
        <SaveOfflineGame players={players} />
      )}
    </main>
  )
}

export default GameOfflineSavePage
