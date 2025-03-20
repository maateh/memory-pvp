type ElapsedTimeReturn = {
  ms: number
  seconds: number
}

/**
 * Calculates the elapsed time between the current date and a given reference date.
 * 
 * This function computes the difference in milliseconds and seconds between the
 * current time and the provided reference date.
 * 
 * @param {Date | string} referenceDate The date to compare against the current time. Can be a Date object or a date string.
 * @returns {ElapsedTimeReturn} An object containing the elapsed time in milliseconds (`ms`) and seconds (`seconds`).
 */
export function elapsedTime(referenceDate: Date | string): ElapsedTimeReturn {
  const refTime = typeof referenceDate === "string"
    ? new Date(referenceDate).getTime()
    : referenceDate.getTime()
  
  const elapsedTime = Date.now() - refTime

  return {
    ms: elapsedTime,
    seconds: Math.round(elapsedTime / 1000)
  }
}
