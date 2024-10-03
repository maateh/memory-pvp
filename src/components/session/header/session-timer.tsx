// utils
import { formatTimer } from "@/lib/utils/game"

// hooks
import { useTimer } from "@/hooks/use-timer"

const SessionTimer = ({ initialInMs }: { initialInMs: number }) => {
  const { timer } = useTimer({ initialInMs })

  return (
    <div className="pt-1.5 pb-0.5 px-4 bg-accent/25 dark:bg-accent/15 rounded-2xl">
      <p className="text-xl sm:text-2xl font-heading font-bold tracking-wider">
        {formatTimer(timer)}
      </p>
    </div>
  )
}

export default SessionTimer
