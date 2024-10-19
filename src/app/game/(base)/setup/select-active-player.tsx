"use client"

// icons
import { UserCheck2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { SelectPlayerDropdown } from "@/components/inputs"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type SelectActivePlayerProps = {
  players: ClientPlayer[]
}

const SelectActivePlayer = ({ players }: SelectActivePlayerProps) => {
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <SelectPlayerDropdown
      players={players}
      handleSelectPlayer={handleSelectAsActive}
      isPending={selectAsActive.isPending}
    >
      <Button className="p-1.5 border border-border/20"
        variant="ghost"
        size="icon"
      >
        <UserCheck2 className="size-4 sm:size-5 text-muted-foreground"
          strokeWidth={1.5}
        />
      </Button>
    </SelectPlayerDropdown>
  )
}

export default SelectActivePlayer
