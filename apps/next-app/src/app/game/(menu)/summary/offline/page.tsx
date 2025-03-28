import { Suspense } from "react"
import dynamic from "next/dynamic"

// db
import { getPlayers } from "@/server/db/query/player-query"

// actions
import { signedIn } from "@/server/action/user-action"

// icons
import { Loader2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await, StatisticListSkeleton } from "@/components/shared"
import { UserManageButton } from "@/components/user"
import SaveOfflineSession from "./save-offline-session"

const OfflineSessionResults = dynamic(() => import("./offline-session-results"), {
  ssr: !!false,
  loading: () => (
    <StatisticListSkeleton
      skeletonProps={{ className: "h-10 sm:h-12" }}
      length={5}
    />
  )
})

const GameSummaryOfflinePage = () => {
  return (
    <>
      <OfflineSessionResults />

      <Separator className="w-2/5 mx-auto my-5 bg-border/25" />

      <Suspense fallback={<Loader2 className="size-7 sm:size-8 shrink-0 mx-auto animate-spin text-muted-foreground" />}>
        <Await promise={Promise.all([signedIn(), getPlayers()])}>
          {([user, players]) => user ? (
            <SaveOfflineSession players={players} />
          ) : (
            <>
              <p className="text-muted-foreground text-lg text-center font-heading font-medium small-caps">
                Please <span className="text-destructive font-semibold">sign in</span> if you want to <span className="text-foreground font-semibold">save the results</span> of this offline session.
              </p>

              <UserManageButton className="mt-1 mx-auto text-base"
                size="lg"
                showSignInIfLoggedOut
              />
            </>
          )}
        </Await>
      </Suspense>
    </>
  )
}

export default GameSummaryOfflinePage
