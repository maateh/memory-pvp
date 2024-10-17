import { formatDistance } from "date-fns"

// types
import type { LucideIcon } from "lucide-react"

// constants
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/constants/game"

// utils
import { pickFields } from "@/lib/utils"
import { formatTimer } from "@/lib/utils/game"

// icons
import { CalendarClock, Dices, Gamepad2, Hash, ScanEye, Sigma, Spade, Star, Timer } from "lucide-react"

export type RenderableStatistic = {
  Icon: LucideIcon
  label: string
  data: string | number
}

type RenderableStatsMap<K extends string> = {
  [key in K]: {
    key: key
  } & RenderableStatistic
}

/** Session stats */
type SessionStatsKeys = 'typeMode' | 'tableSize' | 'timer' | 'matches' | 'flips' | 'startedAt'

/**
 * Generates a map of game session statistics, each stat paired with an icon, label, and formatted data for rendering.
 * 
 * - The stats include session type, mode, table size, timer, matched cards, flips, and the session start time.
 * - Each entry consists of a label, icon, and formatted value, making it easy to display in a UI.
 * - If the `keys` argument is provided, only the corresponding session stats will be included in the result.
 * 
 * @param {ClientGameSession} session - The session whose statistics are being processed.
 * @param {SessionStatsKeys[]} [keys] - Optional list of specific stat keys to include in the result.
 * 
 * @returns {RenderableStatsMap<SessionStatsKeys>} - A map of stats ready to be rendered, optionally filtered by the provided keys.
 */
export function getSessionStatsMap(
  session: ClientGameSession,
  keys?: SessionStatsKeys[]
): RenderableStatsMap<SessionStatsKeys> {
  const playerTag = session.players.current.tag

  const stats: RenderableStatsMap<SessionStatsKeys> = {
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
      data: session.stats.matches[playerTag] + ' matches'
    },
    flips: {
      key: "flips",
      Icon: ScanEye,
      label: "Card Flips",
      data: session.stats.flips[playerTag] + ' flips'
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

/** Player stats */
type PlayerStatsKeys = 'tag' | keyof ClientPlayer['stats']

/**
 * Generates a map of player statistics, each stat paired with an icon, label, and formatted data for rendering.
 * 
 * - The stats include player tag, score, playtime, card flips, matches, and the number of sessions played.
 * - Each entry consists of a label, icon, and formatted value, making it easy to display in a UI.
 * - If the `keys` argument is provided, only the corresponding stats will be included in the result.
 * 
 * @param {ClientPlayer} player - The player whose statistics are being processed.
 * @param {PlayerStatsKeys[]} [keys] - Optional list of specific stat keys to include in the result.
 * 
 * @returns {RenderableStatsMap<PlayerStatsKeys>} - A map of stats ready to be rendered with optional filtering by the provided keys.
 */
export function getPlayerStatsMap(
  player: ClientPlayer,
  keys?: PlayerStatsKeys[]
): RenderableStatsMap<PlayerStatsKeys> {
  const stats: RenderableStatsMap<PlayerStatsKeys> = {
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