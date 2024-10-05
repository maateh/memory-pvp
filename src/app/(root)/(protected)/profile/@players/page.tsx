// server
import { db } from '@/server/db'
import { signedIn } from '@/server/actions/signed-in'

// constants
import { playerProfilesWidgetInfo } from '@/components/widgets/constants'

// components
import { WidgetCard } from '@/components/widgets'
import { Warning } from '@/components/shared'
import { PlayerProfileCard } from '@/components/player/card'

const PlayersWidget = async () => {
  const user = await signedIn()

  let activePlayer: SessionPlayerWithUserAvatar | null | undefined
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
      <h4 className="mt-2 mb-4 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Active player profile
      </h4>

      {activePlayer ? (
        <PlayerProfileCard player={activePlayer} />
      ) : (
        <Warning message="Currently, you don't have any player profile." />
      )}
    </WidgetCard>
  )
}

export default PlayersWidget
