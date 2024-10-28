import { intervalToDuration } from "date-fns"

/**
 * Formats a timer value (in milliseconds) into a `HH:MM:SS` or `MM:SS` string.
 * 
 * @param {number} timerInMs - The timer value in milliseconds.
 * @returns {string} - The formatted time string.
 * 
 * - Pads hours, minutes, and seconds with leading zeros.
 * - If hours are present, returns `HH:MM:SS`. Otherwise, returns `MM:SS`.
 */
export function formatTimer(timerInMs: number): string {
  const duration = intervalToDuration({
    start: 0,
    end: timerInMs
  })

  const zeroPad = (num: number | undefined) => String(num).padStart(2, '0')

  const hours = duration.hours ? zeroPad(duration.hours) : '00'
  const minutes = duration.minutes ? zeroPad(duration.minutes) : '00'
  const seconds = duration.seconds ? zeroPad(duration.seconds) : '00'

  if (duration.hours) return `${hours}:${minutes}:${seconds}`
  return `${minutes}:${seconds}`
}
