// types
import type { ClientPlayer } from "@/lib/types/client"

// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import { PlayerSelectCommand } from "@/components/player/select"

type PlayerSelectPopoverProps = {
  players: ClientPlayer[]
} & React.ComponentProps<typeof PopoverTrigger>

const PlayerSelectPopover = ({ players, ...props }: PlayerSelectPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger {...props} />

      <PopoverContent className="px-2 py-1 border-border/25 rounded-xl">
        <PlayerSelectCommand
          players={players}
          showPopupLink
        />
      </PopoverContent>
    </Popover>
  )
}

export default PlayerSelectPopover
