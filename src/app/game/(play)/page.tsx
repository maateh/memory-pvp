import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

// trpc
import { api } from "@/trpc/server"

// components
import { SessionFooter } from "@/components/session"
import { TablePlayground } from "@/components/session/game"

const GamePlayPage = async () => {
  const { userId } = auth()
  if (!userId) redirect('/game/setup')

  try {
    const session = await api.game.getActive()
  
    return (
      <>
        <TablePlayground session={session} />

        <SessionFooter session={session} />
      </>
    )
  } catch (err) {
    redirect('/game/setup')
  }
}

export default GamePlayPage
