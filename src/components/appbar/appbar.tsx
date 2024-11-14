// server
import { getPlayers } from "@/server/db/player"

// components
import AppbarPrefix from "./appbar-prefix"
import AppbarPlayerStats from "./appbar-player-stats"

const Appbar = async () => {
  const players = await getPlayers()
  const activePlayer = players.find((player) => player.isActive)

  return (
    <div className="h-12 overflow-hidden mx-2.5 my-3 px-2.5 flex flex-wrap items-center gap-x-4 gap-y-6 bg-sidebar border border-sidebar-border/30 text-sidebar-foreground rounded-3xl shadow-lg transition-all sm:mx-5 sm:px-5 sm:flex-nowrap">
      <AppbarPrefix />

      {activePlayer && (
        <AppbarPlayerStats activePlayer={activePlayer} />
      )}
    </div>
  )
}

export default Appbar
