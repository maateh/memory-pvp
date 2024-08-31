import { PlayerProfile, User } from "@prisma/client"

declare global {
  declare type UserWithPlayerProfiles = User & {
    playerProfiles: PlayerProfile[]
  }
}
