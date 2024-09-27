import { formatDistance } from "date-fns"

import { useMemo } from "react"

// icons
import { CalendarClock, ChevronRightCircle, ScanEye, Spade } from "lucide-react"

type SessionStatsProps = {
  session: ClientGameSession
  withTitle?: boolean
}

const SessionStats = ({ session, withTitle = false }: SessionStatsProps) => {
  const stats = useMemo(() => ([
    {
      Icon: CalendarClock,
      label: "Session started",
      data: formatDistance(session.startedAt, Date.now(), { addSuffix: true })
    },
    {
      Icon: Spade,
      label: "Matched cards",
      data: session.cards.filter((card) => card.isMatched).length + ' matches'
    },
    {
      Icon: ScanEye,
      label: "Card flips",
      data: (session.result?.flips || 0) + ' flips'
    }
  ]), [session])

  return (
    <>
      {withTitle && (
        <h3 className="mb-3 text-secondary text-xl text-center font-heading font-medium underline underline-offset-8 decoration-1 sm:text-3xl">
          Session Statistics
        </h3>
      )}

      <ul className="flex flex-col gap-y-2.5">
        {stats.map(({ Icon, data, label }) => (
          <li className="flex-1 flex justify-center items-center gap-x-2"
            key={label}
          >
            <Icon className="size-4 sm:size-5 shrink-0" strokeWidth={1.75} />
            <p className="text-sm sm:text-base font-light small-caps">
              {label}
            </p>
            <ChevronRightCircle className="size-3 sm:size-3.5 shrink-0" strokeWidth={1.75} />
            <p className="text-sm sm:text-base font-heading">
              {data}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SessionStats
