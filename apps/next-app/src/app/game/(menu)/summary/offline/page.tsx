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
import { Await } from "@/components/shared"
import { UserManageButton } from "@/components/user"
import { StatisticListSkeleton } from "@/components/shared"
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

      <Separator className="w-2/5 mx-auto mt-6 mb-8 bg-border/10" />

      <h3 className="mx-auto text-center text-2xl sm:text-3xl small-caps heading-decorator">
        Save <span className="text-accent">Offline</span> Session
      </h3>

      <Separator className="w-1/5 mx-auto mt-2 mb-5 bg-border/5" />

      <Suspense fallback={<Loader2 className="size-7 sm:size-8 shrink-0 mx-auto animate-spin text-muted-foreground" />}>
        <Await promise={Promise.all([signedIn(), getPlayers()])}>
          {([user, players]) => !user ? (
            <UserManageButton className="mx-auto text-base"
              size="lg"
              showSignInIfLoggedOut
            />    
          ): <SaveOfflineSession players={players} />}
        </Await>
      </Suspense>
    </>
  )
}

export default GameSummaryOfflinePage
