"use client"

import { differenceInMinutes } from "date-fns"

import { useState } from "react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useFinishSessionMutation } from "@/lib/react-query/mutations/game"

type SessionWrapperProps = {
  session: ClientGameSession
} & React.PropsWithChildren

const SessionWrapper = ({ session, children }: SessionWrapperProps) => {
  const [forceRunning, setForceRunning] = useState(false)

  const { finishSession, handleFinishSession } = useFinishSessionMutation()

  /**
   * In this case, we care only about CASUAL sessions.
   * 
   * NOTE: not implemented yet
   * COMPETITIVE sessions cannot be continued.
   * After socket connection is closed, competitive sessions
   * are going to be "finished" or "abandoned" automatically.
   */
  const hasActiveCasualSession = session.type === 'CASUAL'
    && session.status === 'RUNNING'
    && differenceInMinutes(Date.now(), session.startedAt) > 0

  return (
    <div className="flex-1 w-full flex justify-center items-center">
      {/* TODO: design */}
      {hasActiveCasualSession && !forceRunning ? (
        <>
          <Button variant="secondary"
            onClick={() => setForceRunning(true)}
          >
            Continue
          </Button>
          <Button variant="destructive"
            onClick={() => handleFinishSession('ABANDONED', session.status === 'OFFLINE')}
            disabled={finishSession.isPending}
          >
            Abandon
          </Button>
        </>
      ) : children}
    </div>
  )
}

export default SessionWrapper
