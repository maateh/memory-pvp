type ElapsedTimeReturn = {
  ms: number
  seconds: number
}

/**
 * TODO: write doc
 * 
 * @param referenceDate 
 * @returns 
 */
export function elapsedTime(referenceDate: Date): ElapsedTimeReturn {
  const refTime = typeof referenceDate === "string"
    ? new Date(referenceDate).getTime()
    : referenceDate.getTime()
  
  const elapsedTime = Date.now() - refTime

  return {
    ms: elapsedTime,
    seconds: Math.round(elapsedTime / 1000)
  }
}
