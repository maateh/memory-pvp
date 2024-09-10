import { GameSession, PlayerProfile } from "@prisma/client"

declare global {
  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user: {
      imageUrl: string | null
    }
  }

  declare type GameSessionWithPlayerProfiles = GameSession & {
    owner: PlayerProfile & {
      user: { imageUrl: string | null }
    }
    guest: (PlayerProfile & {
      user: { imageUrl: string | null }
    }) | null
  }
}
