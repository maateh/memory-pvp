// utils
import { getPlayerStatsMap } from "@/lib/utils/stats"

// icons
import { ChevronRightCircle } from "lucide-react"

// components
import { PlayerBadge, PlayerStatBadge } from "@/components/player"

type NavbarPlayerStatsProps = {
  activePlayer: ClientPlayer
}

const NavbarPlayerStats = ({ activePlayer }: NavbarPlayerStatsProps) => {
  const stats = getPlayerStatsMap(activePlayer, ['score', 'sessions', 'timer'])

  return (
    <div className="h-full flex items-center gap-x-2">
      <PlayerBadge player={activePlayer} />

      <div className="hidden items-center gap-x-2 lg:flex">
        <ChevronRightCircle className="flex-none size-4 text-foreground/80" />

        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {Object.values(stats).map(({ key, data, Icon }) => (
            <li key={key}>
              <PlayerStatBadge Icon={Icon} stat={data} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NavbarPlayerStats
