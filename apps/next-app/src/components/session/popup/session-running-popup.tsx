import { Suspense } from "react"

// types
import type { MatchFormat } from "@repo/db"
import type { ClientSessionVariants } from "@repo/schema/session"

// db
import { getActiveClientSession } from "@/server/db/query/session-query"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { Await, RedirectFallback, StatisticItem, StatisticList } from "@/components/shared"
import {
  Popup,
  PopupContent,
  PopupFooter,
  PopupHeader,
  PopupTrigger
} from "@/components/popup"
import SessionRunningPopupActions from "./session-running-popup-actions"

type SessionRunningPopupProps = ({
  renderer: "trigger"
  session: ClientSessionVariants
  format?: never
} | ({
  renderer: "router"
  format: MatchFormat
  session?: never
} | {
  renderer: "router"
  session: ClientSessionVariants
  format?: never
})) & Omit<React.ComponentProps<typeof PopupTrigger>, "renderer">

const SessionRunningPopup = ({ renderer, session, format, ...props }: SessionRunningPopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent size="sm">
        <PopupHeader
          size="sm"
          title="Active session found"
          description="You have an ongoing game session. Do you want to continue?"
        />

        <Separator className="w-5/6 mx-auto mb-4 md:mb-0 bg-border/15" />

        {session && <SessionRunningPopupContent session={session} />}

        {renderer === "router" && !session && (
          <Suspense fallback={<SessionRunningPopupSkeleton />}>
            <Await promise={getActiveClientSession(format)}>
              {(session) => session ? (
                <SessionRunningPopupContent session={session} />
              ) : (
                <RedirectFallback
                  type="back"
                  message="Session cannot be loaded."
                  description="Unable to load your active session."
                />
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

const SessionRunningPopupContent = ({ session }: { session: ClientSessionVariants }) => (
  <div className="px-4 md:px-0">
    <StatisticList className="max-w-xl mx-auto">
      {Object.values(getRendererSessionStats(session)).map((stat) => (
        <StatisticItem className="min-w-36 max-w-44"
          variant="destructive"
          size="sm"
          statistic={stat}
          key={stat.key}
        />
      ))}
    </StatisticList>

    <Separator className="w-5/6 mx-auto mt-4 bg-border/15" />

    <PopupFooter variant="action" size="sm">
      <SessionRunningPopupActions activeSessionFormat={session.format} />
    </PopupFooter>
  </div>
)

const SessionRunningPopupSkeleton = () => (
  <StatisticList className="w-full mx-auto p-4">
    {Array(6).fill("").map((_, index) => (
      <Skeleton className="w-40 h-12 bg-destructive/10 rounded-2xl"
        key={index}
      />
    ))}
  </StatisticList>
)

export default SessionRunningPopup
