import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

// trpc
import { api } from "@/trpc/server"

// components
import { SessionFooter } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

const GamePlayPage = async () => {
  const { userId } = auth()
  if (!userId) redirect('/game/setup')

  try {
    const session = await api.game.getActive()
  
    return (
      <>
        <MemoryTable
          session={session} // TODO: add cards & flip to db schema
          updateSessionCards={(cards) => {}} // TODO: implement
        />

        <SessionFooter session={session} />
      </>
    )
  } catch (err) {
    redirect('/game/setup')
  }
}

export default GamePlayPage
