import { useRef } from "react"

// utils
import { formatTimer } from "@/lib/utils/game"

// hooks
import { useTimer } from "@/hooks/use-timer"
import { useSessionStore } from "@/hooks/store/use-session-store"

type SessionTimerProps = {
  session: ClientGameSession
}

const SessionTimer = ({ session }: SessionTimerProps) => {
  const initialTimerRef = useRef<number>(session.stats.timer)

  const updateSessionTimer = useSessionStore((state) => state.updateTimer)

  const { timerInMs } = useTimer({
    initialInMs: initialTimerRef.current * 1000,
    onUpdate: ({ timer }) => updateSessionTimer(timer)
  })

  return (
    <div className="absolute top-1/2 left-1/2 sm:static max-sm:transform max-sm:-translate-x-1/2 max-sm:-translate-y-1/2">
      <div className="pt-1.5 pb-0.5 px-4 bg-accent/25 dark:bg-accent/15 rounded-2xl">
        <p className="text-xl sm:text-2xl font-heading font-bold tracking-wider">
          {formatTimer(timerInMs)}
        </p>
      </div>
    </div>
  )
}

export default SessionTimer
