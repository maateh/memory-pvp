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

/**
 * A custom hook for managing a timer with configurable behavior.
 * 
 * - The timer can either increase or decrease over time.
 * - Fires an `onUpdate` callback whenever the timer changes.
 * 
 * @param {Object} options - Configuration options for the timer.
 * @param {TimerType} [options.type="INCREASE"] - Determines if the timer counts up or down.
 * @param {number} [options.initialInMs=0] - Initial value of the timer in milliseconds.
 * @param {number} [options.thresholdInMs=1000] - Amount to increase or decrease the timer per interval, in milliseconds.
 * @param {number} [options.intervalInMs=1000] - Interval at which the timer updates, in milliseconds.
 * @param {function} [options.onUpdate] - Callback function that receives the updated timer values after each interval.
 * 
 * @returns {UseTimerReturn} - Contains the current timer value in both seconds and milliseconds.
 */
export const useTimer = ({
  type = "INCREASE",
  initialInMs = 0,
  thresholdInMs = 1000,
  intervalInMs = 1000,
  onUpdate
}: UseTimerProps = {}): UseTimerReturn => {
  const [timerInMs, setTimerInMs] = useState<number>(initialInMs)

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
