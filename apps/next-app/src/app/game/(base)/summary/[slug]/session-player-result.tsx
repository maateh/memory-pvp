// types
import type { ClientResult } from "@repo/schema/result"
import type { RendererStat, RendererPlayerStatKeys } from "@/lib/types/statistic"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"
import { formatTimer } from "@/lib/util/game"
import { cn } from "@/lib/util"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

type SessionPlayerResultKeys = Extract<RendererPlayerStatKeys, "elo" | "matches" | "flips" | "timer">

type SessionPlayerResultProps = {
  result: ClientResult
}

const SessionPlayerResult = ({ result }: SessionPlayerResultProps) => {
  const { player, session } = result

  /* Note: only `RANKED` session has elo values */
  const eloKey: Array<SessionPlayerResultKeys> = session.mode === "RANKED" ? ["elo"] : []
  const stats = getRendererPlayerStats(player, [...eloKey, "flips", "matches", "timer"])

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
            variant={key === "elo" ? result.gainedElo < 0 ? "destructive" : "default" : "default"}
            size="sm"
            statistic={{
              ...stat,
              data: renderResultData({
                key: key as SessionPlayerResultKeys,
                data: stat.data,
                sessionPlayerResult: {
                  elo: result.gainedElo,
                  flips: result.flips,
                  matches: result.matches,
                  timer: formatTimer(result.timer * 1000)
                }
              })
            }}
            key={key}
          />
        ))}
      </StatisticList>
    </div>
  )
}

type RenderResultDataParams = {
  key: SessionPlayerResultKeys
  data: RendererStat["data"]
  sessionPlayerResult: Pick<PrismaJson.PlayerStats, Exclude<SessionPlayerResultKeys, "timer">> & {
    timer: string
  }
}

/**
 * Renders the data for a player's statistic, incorporating session-specific stat updates.
 * 
 * - This function returns a React node displaying the stat's value along with any changes during the session.
 * - If the session-specific stat is a positive number, it is prefixed with a '+' sign to indicate an increase.
 * - If the key is 'elo' and its value is negative, the stat is styled with a 'destructive' color to indicate a negative impact.
 * 
 * @param {RenderResultDataParams} params - The parameters for rendering the stat.
 * @param {PlayerStatsKeys} params.key - The key representing the specific statistic.
 * @param {RendererStat['data']} params.data - The current value of the statistic to display.
 * @param {Object} params.sessionPlayerStats - An object containing session-specific updates for the player's statistics.
 * 
 * @returns {React.ReactNode} - A JSX element that displays the stat data along with session updates.
 */
function renderResultData({ key, data, sessionPlayerResult }: RenderResultDataParams): React.ReactNode {
  let resultData: number | string = sessionPlayerResult[key]

  if (typeof resultData === "number" && resultData > 0) {
    resultData = `+${resultData}`
  }

  return (
    <p className="flex items-center gap-x-1">
      {data}
      <span className={cn("text-accent", {
        "text-destructive": key === "elo" && (sessionPlayerResult.elo) < 0
      })}>
        ({resultData})
      </span>
    </p>
  )
}

export default SessionPlayerResult
