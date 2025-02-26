import { formatDistance } from "date-fns"

// types
import type { ClientSession } from "@repo/schema/session"
import type { ClientPlayer } from "@repo/schema/player"
import type { RendererStatsMap, RendererSessionStatKeys, RendererPlayerStatKeys } from "@/lib/types/statistic"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// utils
import { pickFields } from "@/lib/util/parser"
import { formatTimer } from "@/lib/util/game"

// icons
import { CalendarClock, Dices, Gamepad2, Hash, ScanEye, Sigma, Spade, Star, Timer } from "lucide-react"

/**
 * Generates a map of game session statistics, each stat paired with an icon, label, and formatted data for rendering.
 * 
 * - The stats include session type, mode, table size, timer, matched cards, flips, and the session start time.
 * - Each entry consists of a label, icon, and formatted value, making it easy to display in a UI.
 * - If the `keys` argument is provided, only the corresponding session stats will be included in the result.
 * 
 * @param {ClientSession} session - The session whose statistics are being processed.
 * @param {RendererSessionStatKeys[]} [keys] - Optional list of specific stat keys to include in the result.
 * 
 * @returns {RendererStatsMap<RendererSessionStatKeys>} - A map of stats ready to be rendered, optionally filtered by the provided keys.
 */
export function getRendererSessionStats(
  session: Pick<ClientSession, "type" | "mode" | "tableSize" | "stats" | "startedAt">,
  keys?: RendererSessionStatKeys[]
): RendererStatsMap<RendererSessionStatKeys> {
  const stats: RendererStatsMap<RendererSessionStatKeys> = {
    typeMode: {
      key: "typeMode",
      Icon: Gamepad2,
      label: gameTypePlaceholders[session.type].label,
      data: gameModePlaceholders[session.mode].label
    },
    tableSize: {
      key: "tableSize",
      Icon: Dices,
      label: tableSizePlaceholders[session.tableSize].label,
      data: tableSizePlaceholders[session.tableSize].size
    },
    timer: {
      key: "timer",
      Icon: Timer,
      label: "Timer",
      data: formatTimer(session.stats.timer * 1000)
    },
    matches: {
      key: "matches",
      Icon: Spade,
      label: "Matched Cards",
      data: Object.values(session.stats.matches)
        .reduce((total, current) => total + current, 0) + " matches"
    },
    flips: {
      key: "flips",
      Icon: ScanEye,
      label: "Card Flips",
      data: Object.values(session.stats.flips)
        .reduce((total, current) => total + current, 0) + " flips"
    },
    startedAt: {
      key: "startedAt",
      Icon: CalendarClock,
      label: "Session Started",
      data: formatDistance(session.startedAt, Date.now(), { addSuffix: true })
    }
  }

  if (!keys) return stats
  return pickFields(stats, keys)
}

/**
 * Generates a map of player statistics, each stat paired with an icon, label, and formatted data for rendering.
 * 
 * - The stats include player tag, score, playtime, card flips, matches, and the number of sessions played.
 * - Each entry consists of a label, icon, and formatted value, making it easy to display in a UI.
 * - If the `keys` argument is provided, only the corresponding stats will be included in the result.
 * 
 * @param {ClientPlayer} player - The player whose statistics are being processed.
 * @param {RendererPlayerStatKeys[]} [keys] - Optional list of specific stat keys to include in the result.
 * 
 * @returns {RendererStatsMap<RendererPlayerStatKeys>} - A map of stats ready to be rendered with optional filtering by the provided keys.
 */
export function getRendererPlayerStats(
  player: Pick<ClientPlayer, "tag" | "stats">,
  keys?: RendererPlayerStatKeys[]
): RendererStatsMap<RendererPlayerStatKeys> {
  const stats: RendererStatsMap<RendererPlayerStatKeys> = {
    tag: {
      key: "tag",
      Icon: Hash,
      label: "Player Tag",
      data: player.tag
    },
    score: {
      key: "score",
      Icon: Star,
      label: "Total Score",
      data: `${player.stats.score} points`
    },
    timer: {
      key: "timer",
      Icon: Timer,
      label: "Playtime",
      data: `${formatTimer(player.stats.timer * 1000)}`
    },
    flips: {
      key: "flips",
      Icon: Sigma,
      label: "Card Flips",
      data: `${player.stats.flips} flips`
    },
    matches: {
      key: "matches",
      Icon: Spade,
      label: "Matched Cards",
      data: `${player.stats.matches} matches`
    },
    sessions: {
      key: "sessions",
      Icon: Gamepad2,
      label: "Played Sessions",
      data: `${player.stats.sessions} sessions`
    }
  }

  if (!keys) return stats
  return pickFields(stats, keys)
}
