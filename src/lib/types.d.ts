import { GameSession, PlayerProfile } from "@prisma/client"

declare global {
  declare type GameSessionWithPlayerProfiles = GameSession & {
    owner: PlayerProfile
    guest: PlayerProfile | null
  }
}
