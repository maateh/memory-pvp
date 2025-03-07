import { useEffect, useRef, useState } from "react"

type TimerType = "increase" | "decrease"

type UseTimerProps = {
  referenceDate: Date
  intervalInMs?: number
  onUpdate?: (timer: UseTimerReturn) => void
} & ({
  timerType: Extract<TimerType, "increase">
  stopAfterInMs?: number
} | {
  timerType: Extract<TimerType, "decrease">
  stopAfterInMs: number
})

type UseTimerReturn = {
  timer: number
  timerInMs: number
  stopped?: boolean
}

/**
 * A custom hook for managing a timer with configurable behavior.
 * Using date value as a reference to count from.
 * 
 * - The timer can either increase or decrease over time.
 * - Fires an `onUpdate` callback whenever the timer changes.
 * 
 * @param {Object} options - Configuration options for the timer.
 * @param {TimerType} [options.timerType="increase"] - Determines if the timer counts up or down.
 * @param {Date} [options.referenceDate] - Reference date value of the timer.
 * @param {number} [options.stopAfterInMs=Number.MAX_SAFE_INTEGER] - Max/min value (based on the timer type) after timer stops counting.
 * @param {number} [options.intervalInMs=1000] - Interval at which the timer updates, in milliseconds.
 * @param {function} [options.onUpdate] - Callback function that receives the updated timer values after each interval.
 * 
 * @returns {UseTimerReturn} - Contains the current timer value in both seconds and milliseconds.
 */
export const useTimer = ({
  timerType,
  referenceDate,
  intervalInMs = 1000,
  stopAfterInMs = Number.MAX_SAFE_INTEGER,
  onUpdate
}: UseTimerProps): UseTimerReturn => {
  const [stopped, setStopped] = useState<boolean>(false)

  const [timerInMs, setTimerInMs] = useState<number>(() => {
    const now = Date.now()
    const refTime = new Date(referenceDate).getTime()

    const initialTimer = now - refTime
    return timerType === "increase"
      ? Math.max(initialTimer, 0)
      : Math.max(stopAfterInMs - initialTimer, 0)
  })

  /**
   * Initialize 'onUpdate' callback. It needs to be done this way
   * to prevent unnecessary retriggers if 'onUpdate' would change.
   */
  const updateRef = useRef(onUpdate)

  useEffect(() => {
    updateRef.current = onUpdate
  }, [onUpdate])

  /**
   * Sets up the timer interval to update the timer value
   * based on the type (increase or decrease).
   * 
   * Updates the timer every `intervalInMs` and triggers
   * the `onUpdate` callback with the latest value.
   */
  useEffect(() => {
    if (stopped) return

    const updateTimer = () => {
      setTimerInMs((prev) => {
        const threshold = timerType === "increase" ? intervalInMs : -intervalInMs
        const timerInMs = prev + threshold
        let stopped = false

        if (
          (timerType === "increase" && timerInMs >= stopAfterInMs) ||
          (timerType === "decrease" && timerInMs <= 0)
        ) stopped = true

        updateRef.current?.({
          timer: timerInMs / 1000,
          timerInMs,
          stopped
        })
        
        setStopped(stopped)
        return timerInMs
      })
    }

    const intervalId = setInterval(updateTimer, intervalInMs)
    return () => clearInterval(intervalId)
  }, [timerType, intervalInMs, stopAfterInMs, stopped])

  return {
    timer: timerInMs / 1000,
    timerInMs,
    stopped
  }
}
