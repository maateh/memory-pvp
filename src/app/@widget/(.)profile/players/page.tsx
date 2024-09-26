// prisma
import { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// shadcn
import { Separator } from "@/components/ui/separator"

// constants
import { playerProfilesWidgetInfo } from "@/components/widgets/constants"

// components
import { WidgetModal } from "@/components/widgets"
import { PlayerProfileForm } from "@/components/player"
import { PlayerProfileCardList } from '@/components/player/card'

const PlayersWidgetModal = async () => {
  const user = await signedIn()

  let players: PlayerProfile[] = []
  if (user) {
    players = await db.playerProfile.findMany({
      where: {
        userId: user.id
      }
    })
  }

  return (
    <WidgetModal isOpen {...playerProfilesWidgetInfo}>
      <div className="space-y-8">
        <h4 className="text-lg font-heading font-bold small-caps">
          Create a new player profile
        </h4>

        <PlayerProfileForm />
      </div>

      <Separator className="w-11/12 my-2.5 mx-auto bg-border/60" />

      <h4 className="text-lg font-heading font-bold small-caps">
        Manage your current profiles
      </h4>

      <PlayerProfileCardList players={players} />
    </WidgetModal>
  )
}

export default PlayersWidgetModal
