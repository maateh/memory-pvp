// trpc
import { api } from "@/trpc/server"

// components
import GameSessionsCard from "./card"

const GameSessionsWidget = async () => {
  // TODO: fetch game sessions

  return (
    <GameSessionsCard />
  )
}

export default GameSessionsWidget
