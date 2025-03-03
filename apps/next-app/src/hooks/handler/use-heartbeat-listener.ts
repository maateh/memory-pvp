import { useEffect, useRef } from "react"

export type UseHeartbeatListenerProps = {
  onHeartbeat: () => Promise<void> | void
  interval?: number
  disabled?: boolean
}

/**
 * Custom React hook for setting up a heartbeat listener that runs at a specified interval.
 *
 * - Calls the `onHeartbeat` function at the given `interval`.
 * - Uses a ref to persist the latest `onHeartbeat` function without reattaching the interval.
 * - Automatically starts when the component mounts unless `disabled` is set to `true`.
 * - Clears the interval when the component unmounts or when `disabled` becomes `true`.
 *
 * @param {UseHeartbeatListenerProps} props - Configuration options for the heartbeat listener.
 * @param {() => Promise<void> | void} props.onHeartbeat - The function to be executed at each interval.
 * @param {number} [props.interval=5000] - The time in milliseconds between each heartbeat call (default: 5000ms).
 * @param {boolean} [props.disabled=false] - Whether the heartbeat listener is disabled.
 */
export function useHeartbeatListener({
  onHeartbeat,
  interval = 5000,
  disabled = false
}: UseHeartbeatListenerProps) {
  const heartbeatRef = useRef(onHeartbeat)

  useEffect(() => {
    heartbeatRef.current = onHeartbeat
  }, [onHeartbeat])

  /**
   * Creates a heartbeat listener that is called every X interval.
   * 
   * Heartbeat listener automatically starts on mount if it's not disabled.
   */
  useEffect(() => {
    if (disabled) return

    const intervalId = setInterval(() => {
      heartbeatRef.current()
    }, interval)

    return () => clearInterval(intervalId)
  }, [interval, disabled])
}
