// server
import { db } from '@/server/db'
import { signedIn } from '@/server/actions/signed-in'

// constants
import { playerProfilesWidgetInfo } from '@/components/widgets/constants'

// components
import { WidgetCard, WidgetSubheader } from '@/components/widgets'
import { Warning } from '@/components/shared'
import { PlayerProfileCard } from '@/components/player/card'

const PlayersWidget = async () => {
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
    <WidgetCard
      widgetLink="/profile/players"
      {...playerProfilesWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3.5">
        Active player profile
      </WidgetSubheader>

      {activePlayer ? (
        <PlayerProfileCard player={activePlayer} />
      ) : (
        <Warning message="Currently, you don't have any player profile." />
      )}
    </WidgetCard>
  )
}

export default PlayersWidget
