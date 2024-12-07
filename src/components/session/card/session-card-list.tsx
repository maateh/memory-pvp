// utils
import { cn } from "@/lib/util"

// components
import { CardItem, Warning } from "@/components/shared"
import { SessionCard, SessionCardSkeleton } from "@/components/session/card"

type SessionCardListProps = {
  sessions: ClientGameSession[]
} & React.ComponentProps<"ul">

const SessionCardList = ({ sessions, className, ...props}: SessionCardListProps) => {
  if (sessions.length === 0) {
    return (
      <CardItem className="py-3.5 justify-center">
        <Warning message="Couldn't find game session with the specified filter or you haven't played in any game session yet." />
      </CardItem>
    )
  }

  return (
    <ul className={cn("space-y-3", className)} {...props}>
      {sessions.map((session) => (
        <CardItem className="rounded-2xl" key={session.slug}>
          <SessionCard session={session} key={session.slug} />
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
