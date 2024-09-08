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

  // TODO:
  // - get game session
  // - check if player is owner or guest -> has access to session (protectedGameProcedure?)
  //   -> otherwise redirect to setup page
  // 
  // - check if session is still running -> it's already in the gameProcedure
  //   -> if RUNNING -> ask user to continue or cancel (create form)
  //   -> if NOT RUNNING -> show info about the session

  const session = await api.game.getActive()

  if (!session) {
    // TODO: a not-found page might be better (?)
    redirect('/game/setup')
  }

  return (
    <>
      <TablePlayground session={session} />
      
      <GameInfoFooter session={session} />
    </>
  )
}

export default GamePlayPage
