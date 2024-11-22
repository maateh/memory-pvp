import { Suspense } from "react"

// server
import { getPlayers } from "@/server/db/player"

// components
import { Await } from "@/components/shared"
import { PlayerSelectDrawer } from "@/components/player/select"
import { PopupLoader } from "@/app/@popup/popup-loader"

const PlayersSelectPopup = () => {
  return (
    <Suspense fallback={<PopupLoader />}>
      <Await promise={getPlayers()}>
        {(players) => (
          <PlayerSelectDrawer
            renderer="router"
            players={players}
          />
        )}
      </Await>
    </Suspense>
  )
}

export default PlayersSelectPopup
