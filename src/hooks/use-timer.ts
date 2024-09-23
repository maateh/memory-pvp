import { useEffect, useState } from "react"

type TimerType = "INCREASE" | "DECREASE"

type UseTimerProps = {
  type?: TimerType
  initialInMs?: number
  thresholdInMs?: number
  intervalInMs?: number
  onUpdate?: (timer: number) => void
}

export const useTimer = ({
  type = "INCREASE",
  initialInMs = 0,
  thresholdInMs = 1000,
  intervalInMs = 1000,
  onUpdate
}: UseTimerProps = {}) => {
  const [timer, setTimer] = useState(initialInMs)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const threshold = type === 'INCREASE' ? thresholdInMs : -thresholdInMs
      setTimer((prev) => {
        const timer = prev + threshold

        if (onUpdate) onUpdate(timer)
        return timer
      })
    }, intervalInMs)

    return () => clearInterval(intervalId)
  }, [type, thresholdInMs, intervalInMs, onUpdate])

  return { timer }
}
