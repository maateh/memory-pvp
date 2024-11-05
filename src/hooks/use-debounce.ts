import { useState, useEffect, useRef } from "react"

type UseDebounceParams = {
  value: string
  delayInMs?: number
  onDebounce?: (debouncedValue: string) => void
}

export function useDebounce({ value, delayInMs = 250, onDebounce }: UseDebounceParams): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value)

  /**
   * Initialize `onDebounce` callback.
   * 
   * Note: It needs to be done this way (by ref) to prevent the debounce handler
   * `useEffect` from retriggering every time when `onDebounce` changes.
   */
  const onDebounceRef = useRef(onDebounce)

  useEffect(() => {
    onDebounceRef.current = onDebounce
  }, [onDebounce])

  /** Debounce handler */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      onDebounceRef.current?.(value)
    }, delayInMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayInMs])

  return debouncedValue
}
