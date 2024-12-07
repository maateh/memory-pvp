/** Offline metadata */
export const offlineSessionMetadata: Omit<ClientGameSession, keyof UnsignedClientGameSession> = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const
