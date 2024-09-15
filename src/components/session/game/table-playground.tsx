"use client"

// types
import { GameSessionClient } from "@/hooks/use-game-store"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { SessionWrapper } from "@/components/session"

// hooks
import { useFinishSessionMutation } from "@/lib/react-query/mutations/game"

type TablePlaygroundProps = {
  session: GameSessionClient
}

const TablePlayground = ({ session }: TablePlaygroundProps) => {
  const { finishSession, handleFinishSession } = useFinishSessionMutation()

  // TODO: implement game logic

  return (
    <SessionWrapper session={session}>
      <Button
        onClick={() => handleFinishSession('FINISHED', session.status === 'OFFLINE')}
        disabled={finishSession.isPending}
      >
        Finish game
      </Button>
    </SessionWrapper>
  )
}

export default TablePlayground
