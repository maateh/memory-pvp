"use client"

// types
import type { WaitingRoomVariants } from "@repo/schema/room"

// settings
import { waitingRoomHeaderMap } from "@/config/room-settings"

// icons
import { Share2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import {
  JoinedPlayer,
  RoomLeaveButton,
  RoomReadyButton
} from "@/components/room"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"
import { useCopy } from "@/hooks/use-copy"

const WaitingRoomScreen = () => {
  const { handleCopy } = useCopy({ showToast: true })

  const room = useRoomStore((state) => state.room) as WaitingRoomVariants
  const currentRoomPlayer = useRoomStore((state) => state.currentRoomPlayer)
  const roomClose = useRoomStore((state) => state.roomClose)
  const roomLeave = useRoomStore((state) => state.roomLeave)
  const roomKick = useRoomStore((state) => state.roomKick)
  const roomReady = useRoomStore((state) => state.roomReady)

  return (
    <div className="flex-1 flex flex-col items-center justify-around gap-y-12">
      <div className="px-4 mb-2 text-center leading-8">
        <h1 className="mx-auto text-xl sm:text-3xl line-clamp-3">
          {waitingRoomHeaderMap[room.status].title}
        </h1>

        <Separator className="my-1.5 bg-border/20" />

        <p className="w-2/3 mx-auto text-sm sm:text-base text-muted-foreground font-light line-clamp-4">
          {waitingRoomHeaderMap[room.status].description}
        </p>

        <Button className="mt-4 border border-border/15 gap-x-2.5 group"
          tooltip="Copy to clipboard"
          variant="ghost"
          onClick={() => handleCopy(room.slug)}
        >
          <Share2 className="size-4 sm:size-5 shrink-0" />

          <Separator className="bg-border/35" orientation="vertical" />

          <div className="mt-0.5 text-base font-heading font-normal">
            <span className="group-hover:hidden">
              Invite code
            </span>
            <span className="hidden group-hover:inline">
              {room.slug}
            </span>
          </div>
        </Button>
      </div>

      <div className="flex flex-col">
        <Separator className="mb-4 bg-border/10" />

        <div className="flex flex-wrap items-center justify-center gap-x-12">
          <JoinedPlayer
            player={room.owner}
          />

          {room.status !== "waiting" && (
            <JoinedPlayer
              player={room.guest}
              disableKick={currentRoomPlayer.role === "guest"}
              handleKick={roomKick}
            />
          )}
        </div>

        <Separator className="-mt-2 mb-8 bg-border/10" />

        <RoomReadyButton
          connectionStatus={room.connectionStatus}
          roomStatus={room.status}
          isReady={currentRoomPlayer.ready}
          handleReady={roomReady}
        />
      </div>

      <RoomLeaveButton
        action={currentRoomPlayer.id === room.owner.id ? "close" : "leave"}
        handleCloseOrLeave={currentRoomPlayer.id === room.owner.id ? roomClose : roomLeave}
        roomStatus={room.status}
        isReady={currentRoomPlayer.ready}
      />
    </div>
  )
}

export default WaitingRoomScreen
