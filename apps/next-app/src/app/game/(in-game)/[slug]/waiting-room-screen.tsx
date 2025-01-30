"use client"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleCheck, CircleCheckBig, DoorClosed, Share2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { JoinedPlayer } from "@/components/room"

// hooks
import { useCopy } from "@/hooks/use-copy"
import { useSessionRoom } from "@/components/provider/session-room-provider"

const WaitingRoomScreen = () => {
  const {
    room,
    currentRoomPlayer,
    roomClose,
    roomLeave,
    roomReady
  } = useSessionRoom<WaitingRoom | JoinedRoom>()
  const { handleCopy } = useCopy({ showToast: true })

  const ReadyIcon = currentRoomPlayer.ready ? CircleCheck : CircleCheckBig

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

      <div className="flex items-center justify-center gap-x-12">
        <JoinedPlayer player={room.owner} />
        {room.status !== "waiting" && <JoinedPlayer player={room.guest} />}
      </div>

      <div className="flex flex-col gap-y-2.5">
        {room.status === "waiting" ? (
          <Button className="gap-x-2"
            tooltip={`Room code: ${room.slug}`}
            variant="outline"
            size="sm"
            onClick={() => handleCopy(room.slug)}
          >
            <Share2 className="size-3.5 sm:size-4 shrink-0"
              strokeWidth={2.25}
            />
            <span className="mt-0.5 text-base font-heading">
              Click to copy invite code
            </span>
          </Button>
        ) : (
          <Button className={cn("gap-x-2", { "opacity-95": currentRoomPlayer.ready })}
            variant={currentRoomPlayer.ready ? "default" : "secondary"}
            size="sm"
            onClick={roomReady}
            disabled={room.status !== "joined"}
          >
            <ReadyIcon className="size-3.5 sm:size-4 shrink-0"
              strokeWidth={2.25}
            />
            <span className="mt-0.5 text-base font-heading">
              {currentRoomPlayer.ready ? "Unready" : "Ready"}
            </span>
          </Button>
        )}

        <Button className="gap-x-2"
          tooltip="Click here to close the session. You will not lose points, even in competitive mode."
          variant="destructive"
          size="sm"
          onClick={currentRoomPlayer.id === room.owner.id ? roomClose : roomLeave}
          disabled={currentRoomPlayer.ready || room.status === "ready" || room.status === "starting"}
        >
          <DoorClosed className="size-4 shrink-0" />
          <span>{currentRoomPlayer.id === room.owner.id ? "Close room" : "Leave room"}</span>
        </Button>
      </div>
    </div>
  )
}

export default WaitingRoomScreen
