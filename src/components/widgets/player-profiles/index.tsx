// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// components
import PlayerProfilesWidgetCard from "./card"

const PlayerProfilesWidget = async () => {
  const user = await signedIn()

  let activePlayer: PlayerProfileWithUserAvatar | null | undefined
  if (user) {
    activePlayer = await db.playerProfile.findFirst({
      where: {
        userId: user.id,
        isActive: true
      },
      include: {
        user: {
          select: { imageUrl: true }
        }
      }
    })
  }

  return (
    <PlayerProfilesWidgetCard
      activePlayer={activePlayer}
    />
  )
}

export default PlayerProfilesWidget
