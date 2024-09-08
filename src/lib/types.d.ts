import { GameSession, PlayerProfile } from "@prisma/client"

declare global {
  declare type GameSessionWithPlayerProfiles = GameSession & {
    sessionOwner: PlayerProfile
    sessionGuest: PlayerProfile | null
  }
}
