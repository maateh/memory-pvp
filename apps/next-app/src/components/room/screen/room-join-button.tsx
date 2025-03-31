"use client"

// utils
import { cn } from "@/lib/util"

// icons
import { PlayCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useJoinRoomAction } from "@/lib/safe-action/session/multiplayer"

type RoomJoinButtonProps = {
  roomSlug: string
} & Omit<React.ComponentProps<typeof Button>, 'tooltip' | 'onClick'>

const RoomJoinButton = ({
  roomSlug,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: RoomJoinButtonProps) => {
  const {
    execute: joinRoom,
    status: joinRoomStatus
  } = useJoinRoomAction()

  return (
    <Button className={cn("ml-auto p-1.5", className)}
      tooltip="Join room..."
      variant={variant}
      size={size}
      onClick={() => joinRoom({ roomSlug })}
      disabled={joinRoomStatus === "executing"}
      {...props}
    >
      <PlayCircle className="size-4 sm:size-5 md:size-6 shrink-0 text-accent" />
    </Button>
  )
}

export default RoomJoinButton
