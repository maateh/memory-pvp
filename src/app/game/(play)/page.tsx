import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

// trpc
import { api } from "@/trpc/server"

// components
import { SessionFooter, SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

const GamePlayPage = async () => {
  const { userId } = auth()
  if (!userId) redirect('/game/setup')

  try {
    // TODO: add cards & flip to db schema
    const session = await api.game.getActive()
  
    return (
      <>
        <SessionHeader session={session} />

        <MemoryTable
          session={session}
          handleCardFlip={(clickedCard) => {}} // TODO: implement
        />

        <SessionFooter session={session} />
      </>
    )
  } catch (err) {
    redirect('/game/setup')
  }
}

export default GamePlayPage
