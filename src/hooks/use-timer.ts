import { useEffect, useRef, useState } from "react"

type TimerType = "INCREASE" | "DECREASE"

type UseTimerProps = {
  type?: TimerType
  initialInMs?: number
  thresholdInMs?: number
  intervalInMs?: number
  onUpdate?: (timer: UseTimerReturn) => void
}

type UseTimerReturn = {
  timer: number
  timerInMs: number
}

export const useTimer = ({
  type = "INCREASE",
  initialInMs = 0,
  thresholdInMs = 1000,
  intervalInMs = 1000,
  onUpdate
}: UseTimerProps = {}): UseTimerReturn => {
  const [timerInMs, setTimerInMs] = useState<number>(initialInMs)

  const updateRef = useRef(onUpdate)

  useEffect(() => {
    updateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const threshold = type === 'INCREASE' ? thresholdInMs : -thresholdInMs

      setTimerInMs((prev) => {
        const timerInMs = prev + threshold
        updateRef.current?.({
          timer: timerInMs / 1000,
          timerInMs
        })
        
        return timerInMs
      })
    }, intervalInMs)

    return () => clearInterval(intervalId)
  }, [type, thresholdInMs, intervalInMs])

  return {
    timer: timerInMs / 1000,
    timerInMs
  }
}
