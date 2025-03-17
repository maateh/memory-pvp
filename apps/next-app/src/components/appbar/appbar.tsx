import { Suspense } from "react"

// db
import { getPlayer } from "@/server/db/query/player-query"

// components
import { Await } from "@/components/shared"
import AppPrefix from "./app-prefix"
import AppPlayerStats, { AppPlayerStatsSkeleton } from "./app-player-stats"

const Appbar = () => {
  return (
    <div className="h-12 overflow-hidden mx-2.5 my-3 px-2.5 flex flex-wrap items-center gap-x-4 gap-y-6 bg-sidebar border border-sidebar-border/30 text-sidebar-foreground rounded-3xl shadow-lg transition-all sm:mx-5 sm:px-5 sm:flex-nowrap">
      <AppPrefix />

      <Suspense fallback={<AppPlayerStatsSkeleton />}>
        <Await promise={getPlayer({ isActive: true })}>
          {(player) => player && <AppPlayerStats activePlayer={player} />}
        </Await>
      </Suspense>
    </div>
  )
}

export default Appbar
