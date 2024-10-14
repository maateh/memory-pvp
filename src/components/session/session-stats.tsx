"use client"

import { formatDistance } from "date-fns"

import { useMemo } from "react"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// utils
import { formatTimer } from "@/lib/utils/game"

// icons
import { CalendarClock, Dices, Gamepad2, ScanEye, Spade, Timer } from "lucide-react"

// components
import { StatisticItem, StatisticList } from "@/components/shared/statistics"

type SessionStatsProps = {
  session: ClientGameSession
  withTitle?: boolean
}

const SessionStats = ({ session, withTitle = false }: SessionStatsProps) => {
  const playerTag = session.players.current.tag

  const stats = useMemo(() => ([
    {
      Icon: Gamepad2,
      label: gameTypePlaceholders[session.type].label,
      data: gameModePlaceholders[session.mode].label
    },
    {
      Icon: Dices,
      label: tableSizePlaceholders[session.tableSize].label,
      data: tableSizePlaceholders[session.tableSize].size
    },
    {
      Icon: CalendarClock,
      label: "Session started",
      data: formatDistance(session.startedAt, Date.now(), { addSuffix: true })
    },
    {
      Icon: Timer,
      label: "Timer",
      data: formatTimer(session.stats.timer * 1000)
    },
    {
      Icon: Spade,
      label: "Matched cards",
      data: session.stats.matches[playerTag] + ' matches'
    },
    {
      Icon: ScanEye,
      label: "Card flips",
      data: session.stats.flips[playerTag] + ' flips'
    }
  ]), [session])

  return (
    <>
      {withTitle && (
        <h3 className="mb-3 text-foreground/85 text-2xl text-center font-heading font-medium underline underline-offset-8 decoration-1 sm:text-3xl">
          Session Statistics
        </h3>
      )}

      <StatisticList className="px-2 max-w-4xl">
        {stats.map((stat) => (
          <StatisticItem className="min-w-40 max-w-60 sm:min-w-60"
            statistic={stat}
            key={stat.label}
          />
        ))}
      </StatisticList>
    </>
  )
}

export default SessionStats
