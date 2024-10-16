// utils
import { formatTimer } from "@/lib/utils/game"

// icons
import { ChevronRightCircle, Gamepad2, LucideIcon, Sparkles, Timer } from "lucide-react"

// components
import { PlayerBadge, PlayerStatBadge } from "@/components/player"

type NavbarPlayerStatsProps = {
  activePlayer: ClientPlayer
}

const NavbarPlayerStats = ({ activePlayer }: NavbarPlayerStatsProps) => {
  const stats = getPlayerStatsMap(activePlayer.stats)

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

/** Local utils */
type PlayerStatsMap = {
  [K in keyof Partial<ClientPlayer['stats']>]: {
    key: K
    Icon: LucideIcon
    data: string
  }
}

function getPlayerStatsMap(stats: Pick<ClientPlayer['stats'], 'score' | 'timer' | 'sessions'>): PlayerStatsMap {
  const { score, timer, sessions } = stats

  return {
    score: {
      key: 'score',
      Icon: Sparkles,
      data: `${score} points`
    },
    timer: {
      key: 'timer',
      Icon: Timer,
      data: `${formatTimer(timer * 1000)} playtime`
    },
    sessions: {
      key: 'sessions',
      Icon: Gamepad2,
      data: `${sessions} sessions`
    }
  }
}

export default NavbarPlayerStats
