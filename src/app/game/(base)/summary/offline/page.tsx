import dynamic from "next/dynamic"

// server
import { signedIn } from "@/server/actions/signed-in"
import { getPlayers } from "@/server/actions/player"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton, Warning } from "@/components/shared"
import SaveOfflineSession from "./save-offline-session"
const OfflineSessionResults = dynamic(() => import('./offline-session-results'), { ssr: false })

const OfflineSessionSummaryPage = async () => {
  const user = await signedIn()
  const players = await getPlayers()

  return (
    <>
      <p className="-mt-3 max-w-lg mx-auto text-center font-heading text-base sm:text-xl">
        Your <span className="text-accent font-medium">offline game</span> is over, thanks for playing!
      </p>
      
      <Separator className="w-3/5 mx-auto mt-4 mb-6 bg-border/5" />

      <OfflineSessionResults />

      <Separator className="w-1/5 mx-auto mt-6 mb-8 bg-border/10" />

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
        <SaveOfflineSession players={players} />
      )}
    </>
  )
}

export default OfflineSessionSummaryPage
