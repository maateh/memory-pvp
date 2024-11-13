// server
import { getPlayers } from "@/server/db/player"

// components
import AppbarPrefix from "./appbar-prefix"
import AppbarPlayerStats from "./appbar-player-stats"

const Appbar = async () => {
  const players = await getPlayers()
  const activePlayer = players.find((player) => player.isActive)

  return (
    <div className="z-50 h-12 overflow-hidden mx-2.5 my-3 px-2.5 flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-6 items-center bg-sidebar border border-sidebar-border/30 text-sidebar-foreground rounded-3xl shadow-lg sm:mx-5 sm:px-5 transition-all md:py-2">
      <div className="h-full flex items-center">
        <AppbarPrefix />
      </div>

      {activePlayer && (
        <AppbarPlayerStats activePlayer={activePlayer} />
      )}
    </div>
  )
}

export default Appbar