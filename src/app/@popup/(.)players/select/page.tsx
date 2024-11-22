// server
import { getPlayers } from "@/server/db/player"

// components
import { PlayerSelectDrawer } from "@/components/player/select"

const PlayersSelectPopupPage = async () => {
  const players = await getPlayers()

  // TODO: skeleton fallback
  return (
    <PlayerSelectDrawer
      renderer="router"
      players={players}
    />
  )
}

export default PlayersSelectPopupPage
