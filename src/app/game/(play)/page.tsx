import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

// trpc
import { api } from "@/trpc/server"

// components
import { GameInfoFooter, TablePlayground } from "@/components/game"

const GamePlayPage = async () => {
  const { userId } = auth()
  if (!userId) redirect('/game/setup')

  try {
    const session = await api.game.getActive()
  
    return (
      <>
        <TablePlayground session={session} />

        <GameInfoFooter session={session} />
      </>
    )
  } catch (err) {
    redirect('/game/setup')
  }
}

export default GamePlayPage
