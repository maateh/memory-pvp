// types
import type { SessionFilter, SessionSort } from "@/components/session/filter/types"

// server
import { getClientSessions } from "@/server/db/session"

// utils
import { cn } from "@/lib/utils"

// components
import { CardItem, Warning } from "@/components/shared"
import { SessionCard, SessionCardSkeleton } from "@/components/session/card"

type SessionCardListProps = {
  filter: SessionFilter
  sort: SessionSort
} & React.ComponentProps<"ul">

const SessionCardList = async ({
  filter, sort,
  className,
  ...props
}: SessionCardListProps) => {
  const sessions = await getClientSessions({ filter, sort,  })

  if (sessions.length === 0) {
    const message = filter
      ? "Couldn't find game session with the specified filter."
      : "You have no game session history yet."

    return (
      <CardItem className="py-3.5 justify-center">
        <Warning message={message} />
      </CardItem>
    )
  }

  return (
    <ul className={cn("space-y-3", className)} {...props}>
      {sessions.map((session) => (
        <CardItem className="rounded-2xl" key={session.slug}>
          <SessionCard session={session} />
        </CardItem>
      ))}
    </ul>
  )
}

const SessionCardListSkeleton = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("space-y-3", className)} {...props}>
      {Array(3).fill('').map((_, index) => (
        <CardItem key={index}>
          <SessionCardSkeleton />
        </CardItem>
      ))}
    </ul>
  )
}

export default SessionCardList
export { SessionCardListSkeleton }
