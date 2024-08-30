import { Player, Profile } from "@prisma/client"

declare global {
  declare type PlayerWithProfile = Player & {
    profile: Profile
  }
}
