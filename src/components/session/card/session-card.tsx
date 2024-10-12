import Link from "next/link"

// prisma
import type { GameSession } from "@prisma/client"

// utils
import { cn } from "@/lib/utils"

// icons
import { ExternalLink, Hash } from "lucide-react"

// components
import { SessionBasics } from "@/components/session"

type SessionCardProps = {
  session: Omit<GameSession, 'id'>
}

const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-x-3">
        <div className={cn("size-3.5 rounded-full border border-border", {
          "bg-yellow-500 dark:bg-yellow-200": session.status === 'RUNNING',
          "bg-secondary": session.status === 'FINISHED',
          "bg-destructive": session.status === 'ABANDONED',
        })} />

        <div className="flex flex-col gap-y-2">
          <div className="w-fit px-2.5 flex items-center gap-x-1.5 bg-muted/75 rounded-xl">
            <Hash className="size-3" strokeWidth={4} />

            <p className="font-heading font-light">
              {session.slug}
            </p>
          </div>

          <SessionBasics
            badgeProps={{ className: "py-0 px-2" }}
            iconProps={{ className: "size-3.5" }}
            session={session}
          />
        </div>
      </div>

      <Link href={`/game/summary/${session.slug}`}>
        <ExternalLink className="size-4 sm:size-5 text-muted-foreground transition group-hover:text-foreground/90" />
      </Link>
    </div>
  )
}

export default SessionCard
