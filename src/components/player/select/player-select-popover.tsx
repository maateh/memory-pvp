"use client"

import { useState } from "react"

// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import { PlayerSelectCommand } from "@/components/player/select"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type PlayerSelectPopoverProps = {
  players: ClientPlayer[]
} & React.ComponentProps<typeof PopoverTrigger>

const PlayerSelectPopover = ({ players, ...props }: PlayerSelectPopoverProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger {...props} />

      <PopoverContent className="px-2 py-1 border-border/25 rounded-xl">
        <PlayerSelectCommand
          players={players}
          handleSelect={(player) => {
            handleSelectAsActive(player)
            setOpen(false)
          }}
          isPending={selectAsActive.isPending}
          showCreateButton
        />
      </PopoverContent>
    </Popover>
  )
}

export default PlayerSelectPopover
