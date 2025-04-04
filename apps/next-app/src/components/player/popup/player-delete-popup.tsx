import { Suspense } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"

// server
import { getPlayer } from "@/server/db/query/player-query"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"

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
import PlayerDeletePopupActions from "./player-delete-popup-actions"

type PlayerDeletePopupProps = ({
  renderer: "trigger"
  player: ClientPlayer
  playerTag?: never
} | {
  renderer: "router"
  playerTag: string
  player?: never
}) & React.ComponentProps<typeof PopupTrigger>

const PlayerDeletePopup = ({ renderer, player, playerTag, ...props }: PlayerDeletePopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent size="sm">
        <PopupHeader
          title="Delete player profile"
          description="Are you sure you want to delete this player profile?"
          size="sm"
        />

        {renderer === "trigger" && <PlayerDeletePopupContent player={player} />}

        {renderer === "router" && (
          <Suspense fallback={<PlayerDeletePopupSkeleton />}>
            <Await promise={getPlayer({ tag: playerTag })}>
              {(player) => player ? (
                <PlayerDeletePopupContent player={player} />
              ) : (
                <RedirectFallback
                  type="back"
                  message="Player cannot be loaded."
                  description="Unable to find player with this identifier."
                />
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

const PlayerDeletePopupContent = ({ player }: { player: ClientPlayer }) => (
  <>
    <StatisticList className="px-4 mt-2 max-w-lg mx-auto">
      {Object.values(getRendererPlayerStats(player, ["tag", "elo", "timer"])).map((stat) => (
        <StatisticItem className="min-w-32 max-w-40"
          variant="destructive"
          size="sm"
          statistic={stat}
          key={stat.key}
        />
      ))}
    </StatisticList>

    <Separator className="mt-4 md:mt-2 md:-mb-2 bg-border/15" />

    <PopupFooter variant="action" size="sm">
      <PlayerDeletePopupActions player={player} />
    </PopupFooter>
  </>
)

const PlayerDeletePopupSkeleton = () => (
  <StatisticList className="w-full max-w-md mx-auto">
    {Array(3).fill("").map((_, index) => (
      <Skeleton className="w-32 h-12 bg-destructive/10 rounded-2xl"
        key={index}
      />
    ))}
  </StatisticList>
)

export default PlayerDeletePopup
