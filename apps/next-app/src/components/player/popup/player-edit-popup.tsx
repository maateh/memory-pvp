import { Suspense } from "react"

// server
import { getPlayer } from "@/server/db/query/player-query"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { PlayerProfileForm } from "@/components/player/form"
import { Popup, PopupContent, PopupHeader, PopupTrigger } from "@/components/popup"
import { Await, RedirectFallback } from "@/components/shared"

type PlayerEditPopupProps = ({
  renderer: "trigger"
  player: ClientPlayer
  playerTag?: never
} | {
  renderer: "router"
  playerTag: string
  player?: never
}) & Omit<React.ComponentProps<typeof PopupTrigger>, 'renderer'>

const PlayerEditPopup = ({ renderer, player, playerTag, ...props }: PlayerEditPopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent className="pb-6 md:pb-8" size="sm">
        <PopupHeader
          title="Update player"
          description="Update the name or the color identifier of your player profile."
        />

        <Separator className="mb-6 bg-border/15 md:mb-4" />

        {renderer === "trigger" && (
          <PlayerProfileForm className="px-4"
            type="edit"
            defaultValues={player}
          />
        )}

        {renderer === "router" && (
          <Suspense fallback={<Skeleton className="w-11/12 h-9 mx-auto bg-muted-foreground/20" />}>
            <Await promise={getPlayer({ filter: { tag: playerTag } })}>
              {(player) => player ? (
                <PlayerProfileForm className="px-4"
                  type="edit"
                  defaultValues={player}
                />
              ) : (
                <RedirectFallback
                  type="back"
                  message="Player profile cannot be loaded."
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

export default PlayerEditPopup
