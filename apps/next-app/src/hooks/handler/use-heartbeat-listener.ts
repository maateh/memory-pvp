import { useEffect, useRef } from "react"

export type UseHeartbeatListenerProps = {
  onHeartbeat: () => Promise<void> | void
  interval?: number
  disabled?: boolean
}

/**
 * TODO: write doc
 * 
 * @param props
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
