import { Suspense } from "react"

// actions
import { getActiveSession } from "@/server/actions/session"

// utils
import { getSessionStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import {
  Popup,
  PopupContent,
  PopupFooter,
  PopupHeader,
  PopupRedirectFallback,
  PopupTrigger
} from "@/components/popup"
import { Await, StatisticItem, StatisticList } from "@/components/shared"
import SessionRunningPopupActions from "./session-running-popup-actions"

type SessionRunningPopupProps = ({
  renderer: "trigger"
  session: ClientGameSession
} | {
  renderer: "router"
  session?: ClientGameSession
}) & Omit<React.ComponentProps<typeof PopupTrigger>, 'renderer'>

const SessionRunningPopup = ({ renderer, session, ...props }: SessionRunningPopupProps) => {
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

        {session && <SessionRunningContent session={session} />}

        {renderer === 'router' && !session && (
          <Suspense fallback="loading..."> {/* TODO: skeleton */}
            <Await promise={getActiveSession()}>
              {(session) => session?.data ? (
                <SessionRunningContent session={session.data} />
              ) : (
                <PopupRedirectFallback
                  message="Popup cannot be loaded."
                  description="Unable to find active session."
                />
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

const SessionRunningContent = ({ session }: { session: ClientGameSession }) => (
  <div className="px-4 md:px-0">
    <StatisticList className="max-w-xl mx-auto">
      {Object.values(getSessionStatsMap(session)).map((stat) => (
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
      <SessionRunningPopupActions />
    </PopupFooter>
  </div>
)

export default SessionRunningPopup
