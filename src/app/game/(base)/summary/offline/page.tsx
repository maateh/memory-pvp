import dynamic from "next/dynamic"

// server
import { signedIn } from "@/server/db/signed-in"
import { getPlayers } from "@/server/db/player"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { UserManageButton } from "@/components/user"
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
        <UserManageButton className="mx-auto text-base"
          size="lg"
          user={null}
          showSignInIfLoggedOut
        />
      ) : (
        <SaveOfflineSession players={players} />
      )}
    </>
  )
}

export default OfflineSessionSummaryPage
