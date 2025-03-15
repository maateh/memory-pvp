import { Suspense } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"

// db
import { getPlayers } from "@/server/db/query/player-query"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Await } from "@/components/shared"
import { PlayerProfileForm } from "@/components/player/form"
import { PlayerSelectCommand, PlayerSelectCommandSkeleton } from "@/components/player/select"
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTrigger } from "@/components/popup"

type PlayerSelectPopupProps = ({
  renderer: "trigger"
  players: ClientPlayer[]
} | {
  renderer: "router"
  players?: never
}) & Omit<React.ComponentProps<typeof PopupTrigger>, "renderer">

const PlayerSelectPopup = ({ renderer, players, ...props }: PlayerSelectPopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent>
        <PopupHeader
          title="Select active player"
          description="Player profiles makes it easier to use smurf accounts if you want."
        />

        <Separator className="w-5/6 mx-auto mb-3 bg-border/15" />

        {renderer === "trigger" && (
          <PlayerSelectCommand className="max-w-screen-md mx-auto px-4 sm:px-8"
            listProps={{ className: "w-full max-w-lg mx-auto px-2" }}
            players={players}
          />
        )}

        {renderer === "router" && (
          <Suspense fallback={(
            <PlayerSelectCommandSkeleton className="w-full max-w-xl mx-auto"
              listProps={{ className: "max-w-md mx-auto" }}
            />
          )}>
            <Await promise={getPlayers()}>
              {(players) => (
                <PlayerSelectCommand className="max-w-screen-md mx-auto px-4 sm:px-8"
                  listProps={{ className: "w-full max-w-lg mx-auto px-2" }}
                  players={players}
                />
              )}
            </Await>
          </Suspense>
        )}

        <Separator className="w-5/6 mx-auto my-3 bg-border/15" />

        <PopupFooter>
          <h3 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
            Create new player profile
          </h3>

          <PlayerProfileForm />
        </PopupFooter>
      </PopupContent>
    </Popup>
  )
}

export default PlayerSelectPopup
