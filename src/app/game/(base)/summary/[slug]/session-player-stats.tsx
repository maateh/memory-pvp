// helpers
import { calculatePlayerSessionScore } from "@/lib/helper/session-helper"

// utils
import { cn } from "@/lib/util"
import { formatTimer } from "@/lib/util/game"
import { getRendererPlayerStats } from "@/lib/util/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

type SessionPlayerStatKeys = Extract<RendererPlayerStatKeys, 'score' | 'timer' | 'matches' | 'flips'>

type SessionPlayerStatsProps = {
  player: ClientPlayer
  session: ClientGameSession
}

const SessionPlayerStats = ({ player, session }: SessionPlayerStatsProps) => {
  const score = calculatePlayerSessionScore(
    session,
    player.id,
    session.status === 'FINISHED' ? 'finish' : 'abandon'
  )

  const sessionPlayerStats = {
    score: score || 0,
    flips: session.stats.flips[player.id],
    matches: session.stats.matches[player.id],
    timer: formatTimer(session.stats.timer * 1000)
  }

  /* Note: only `COMPETITIVE` sessions have score values */
  const scoreKey: Array<SessionPlayerStatKeys> = score ? ['score'] : []
  const stats = getRendererPlayerStats(player, [...scoreKey, 'flips', 'matches', 'timer'])

  return (
    <div>
      <h3 className="mx-auto text-center text-2xl sm:text-3xl font-heading heading-decorator">
        <span className="text-accent">
          {player.tag}&apos;s
        </span> stats
      </h3>

      <Separator className="w-1/6 mx-auto mt-1 mb-2.5 bg-border/5" />

      <StatisticList className="w-fit mx-auto grid sm:grid-cols-2">
        {Object.values(stats).map(({ key, ...stat }) => (
          <StatisticItem className="w-full mx-auto max-w-48"
            variant={key === 'score' ? (sessionPlayerStats.score) < 0 ? 'destructive' : 'default' : 'default'}
            size="sm"
            statistic={{
              ...stat,
              data: renderStatData({
                key: key as SessionPlayerStatKeys,
                data: stat.data,
                sessionPlayerStats
              })
            }}
            key={key}
          />
        ))}
      </StatisticList>
    </div>
  )
}

/* Local utils */
type RenderStatDataParams = {
  key: SessionPlayerStatKeys
  data: RendererStat['data']
  sessionPlayerStats: Pick<PrismaJson.PlayerStats, Exclude<SessionPlayerStatKeys, 'timer'>> & {
    timer: string
  }
}

/**
 * Renders the data for a player's statistic, incorporating session-specific stat updates.
 * 
 * - This function returns a React node displaying the stat's value along with any changes during the session.
 * - If the session-specific stat is a positive number, it is prefixed with a '+' sign to indicate an increase.
 * - If the key is 'score' and the score value is negative, the stat is styled with a 'destructive' color to indicate a negative impact.
 * 
 * @param {RenderStatDataParams} params - The parameters for rendering the stat.
 * @param {PlayerStatsKeys} params.key - The key representing the specific statistic.
 * @param {RendererStat['data']} params.data - The current value of the statistic to display.
 * @param {Object} params.sessionPlayerStats - An object containing session-specific updates for the player's statistics.
 * 
 * @returns {React.ReactNode} - A JSX element that displays the stat data along with session updates.
 */
function renderStatData({ key, data, sessionPlayerStats }: RenderStatDataParams): React.ReactNode {
  let sessionPlayerStat: number | string = sessionPlayerStats[key]

  if (typeof sessionPlayerStat === 'number' && sessionPlayerStat > 0) {
    sessionPlayerStat = `+${sessionPlayerStat}`
  }

  return (
    <p className="flex items-center gap-x-1">
      {data}
      <span className={cn("text-accent", {
        "text-destructive": key === 'score' && (sessionPlayerStats.score) < 0
      })}>
        ({sessionPlayerStat})
      </span>
    </p>
  )
}

export default SessionPlayerStats
