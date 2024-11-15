import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Determines if the current screen width is below the mobile breakpoint.
 * 
 * **Note**: This custom hook comes from shadcn/ui.
 *
 * - Uses a media query to check if the viewport width is less than the specified `MOBILE_BREAKPOINT`.
 * - Adds an event listener to update the `isMobile` state when the viewport changes.
 * - Returns a boolean indicating whether the viewport is considered mobile-sized.
 *
 * @returns {boolean} - `true` if the viewport width is below the mobile breakpoint, otherwise `false`.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
