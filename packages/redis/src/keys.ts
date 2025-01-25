export function getKeyName(...args: string[]) {
  return `memory:${args.join(":")}`
}

export const sessionKey = (slug: string) => getKeyName("sessions", slug)
export const roomKey = (slug: string) => getKeyName("session_rooms", slug)
export const connectionKey = (socketId: string) => getKeyName("connections", socketId)
