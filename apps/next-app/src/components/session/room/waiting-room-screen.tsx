"use client"

// types
import type { WaitingRoom } from "@repo/schema/session-room"

// icons
import { DoorClosed, Share2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { CustomTooltip } from "@/components/shared"
import { WaitingPlayer } from "./custom"

// hooks
import { useSessionRoom } from "@/components/provider/session-room-provider"

const WaitingRoomScreen = () => {
  const { room } = useSessionRoom() as { room: WaitingRoom}

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-y-12">
      <div className="px-4 mb-2 text-center leading-8">
        <h1 className="text-xl sm:text-3xl heading-decorator">
          Waiting for another player to join...
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground">
          ...or share the invite code with your friends.
        </p>
      </div>

      <WaitingPlayer player={room.owner} />

      <CustomTooltip className="flex items-center gap-x-2"
        tooltipProps={{ className: "text-muted-foreground font-light border-border/40" }}
        tooltip={`Code: ${room.slug}`}
      >
        <Share2 className="size-4 sm:size-5 text-muted-foreground" strokeWidth={2.25} />

        <p className="mt-0.5 text-base text-muted-foreground font-heading">
          {/* TODO: create useCopy() custom hook */}
          Click to copy invite code
        </p>
      </CustomTooltip>

      <Button className="gap-x-2"
        size="sm"
        variant="destructive"
        onClick={() => {}} // TODO: implement closing room
      >
        <DoorClosed className="size-4" />
        <span>Close room</span>
      </Button>
    </div>
  )
}

export default WaitingRoomScreen
