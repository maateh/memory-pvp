"use client"

import { useMemo } from "react"

// settings
import { roomHeaderMap } from "@/config/room-settings"

// utils
import { getRendererSessionStats } from "@/lib/util/stats"

// icons
import { Share2, X } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { GlowingOverlay, StatisticItem, StatisticList } from "@/components/shared"
import {
  JoinedPlayer,
  RoomLeaveButton,
  RoomReadyButton
} from "@/components/room"

// hooks
import { useCopy } from "@/hooks/use-copy"
import { useRoomStore } from "@/components/provider/room-store-provider"

const RoomScreen = () => {
  const { handleCopy } = useCopy({ showToast: true })

  // TODO: implement session reconnection
  const room = useRoomStore((state) => state.room)
  const currentRoomPlayer = useRoomStore((state) => state.currentRoomPlayer)
  const roomClose = useRoomStore((state) => state.roomClose)
  const roomLeave = useRoomStore((state) => state.roomLeave)
  const roomKick = useRoomStore((state) => state.roomKick)
  const roomReady = useRoomStore((state) => state.roomReady)

  const HeaderIcon = roomHeaderMap[room.status].Icon

  const stats = useMemo(() => {
    if (room.status === "cancelled") {
      return getRendererSessionStats(room.session, ["typeMode", "tableSize", "timer", "matches"])
    }

    return getRendererSessionStats({
      ...room.settings,
      stats: {
        flips: {},
        matches: {},
        timer: 0
      },
      startedAt: room.createdAt
    }, ["typeMode", "tableSize"])
  }, [room])

  return (
    <div className="flex-1 flex flex-col items-center justify-around gap-y-8">
      <div className="px-4 mb-2 text-center leading-8">
        <GlowingOverlay className="size-6 mx-auto mb-2"
          overlayProps={{ className: "bg-muted-foreground opacity-85 dark:opacity-50 inset-0" }}
        >
          <HeaderIcon className="size-full shrink-0 text-muted-foreground"
            strokeWidth={2.25}
          />
        </GlowingOverlay>

        <h1 className="mx-auto text-xl sm:text-3xl line-clamp-3">
          {roomHeaderMap[room.status].title}
        </h1>

        <Separator className="my-1.5 bg-border/20" />

        <p className="w-2/3 mx-auto text-sm sm:text-base text-muted-foreground font-light line-clamp-4">
          {roomHeaderMap[room.status].description}
        </p>

        {(room.status === "waiting" || room.status === "joined") && (
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
        )}
      </div>

      <StatisticList className="max-w-sm gap-x-8">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="w-full min-w-32 max-w-40"
            size="sm"
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>

      <div className="flex flex-col">
        <Separator className="mb-1.5 bg-border/10" />

        <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-24">
          <JoinedPlayer player={room.owner} />

          {room.status !== "waiting" && (
            <JoinedPlayer
              player={room.guest}
              disableKick={currentRoomPlayer.role === "guest"}
              handleKick={roomKick}
            />
          )}
        </div>

        <Separator className="mt-1.5 bg-border/10" />
      </div>

      <div className="space-y-10 sm:space-y-12">
        <RoomReadyButton
          connectionStatus={room.connectionStatus}
          roomStatus={room.status}
          isReady={currentRoomPlayer.ready}
          handleReady={roomReady}
        />

        <RoomLeaveButton
          action={currentRoomPlayer.id === room.owner.id ? "close" : "leave"}
          handleCloseOrLeave={currentRoomPlayer.id === room.owner.id ? roomClose : roomLeave}
          roomStatus={room.status}
          isReady={currentRoomPlayer.ready}
        />
      </div>
    </div>
  )
}

export default RoomScreen
