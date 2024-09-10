"use client"

// types
import { GameSessionClient } from "@/hooks/use-game-store"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { SessionPreparer } from "@/components/game"

// hooks
import { useFinishSessionMutation } from "@/lib/react-query/mutations/game"

type TablePlaygroundProps = {
  session: GameSessionClient
}

const TablePlayground = ({ session }: TablePlaygroundProps) => {
  const { finishSession, handleFinishSession } = useFinishSessionMutation()

  // TODO: implement game logic

  return (
    <SessionPreparer session={session}>
      <Button
        onClick={() => handleFinishSession('FINISHED', { offline: session.status === 'OFFLINE' })}
        disabled={finishSession.isPending}
      >
        Finish game
      </Button>
    </SessionPreparer>
  )
}

export default TablePlayground
