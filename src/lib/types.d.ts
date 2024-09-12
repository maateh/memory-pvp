import { GameSession, PlayerProfile } from "@prisma/client"

declare global {
  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user: {
      imageUrl: string | null
    }
  }

  declare type GameSessionWithPlayerProfiles = GameSession & {
    owner: PlayerProfileWithUserAvatar
    guest: PlayerProfileWithUserAvatar | null
  }
}
