import { useState, useEffect } from "react"

type UseDebounceParams = {
  value: string
  delayInMs?: number
}

export function useDebounce({ value, delayInMs = 250 }: UseDebounceParams): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayInMs])

  return debouncedValue
}
