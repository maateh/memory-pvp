import dynamic from "next/dynamic"

// server
import { signedIn } from "@/server/actions/signed-in"
import { getPlayers } from "@/server/actions/player"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SignInButton, Warning } from "@/components/shared"
import { SessionStatisticsSkeleton } from "@/components/session/summary"
import SaveOfflineSession from "./save-offline-session"

const OfflineSessionResults = dynamic(() => import('./offline-session-results'), {
  ssr: false,
  loading: SessionStatisticsSkeleton
})

const OfflineSessionSummaryPage = async () => {
  const user = await signedIn()
  const players = await getPlayers()

  return (
    <>
      <OfflineSessionResults />

      <Separator className="w-2/5 mx-auto mt-6 mb-8 bg-border/10" />

      <h3 className="mx-auto text-center text-2xl sm:text-3xl small-caps heading-decorator">
        Save <span className="text-accent">Offline</span> Session
      </h3>

      <Separator className="w-1/5 mx-auto mt-2 mb-5 bg-border/5" />

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
