"use client"

// prisma
import type { PlayerProfile } from "@prisma/client"

// utils
import { cn } from "@/lib/utils"

// icons
import { ChevronDown, UserRoundCheck } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// components
import { PlayerBadge } from "@/components/player"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type SelectActivePlayerDropdownProps = {
  players: PlayerProfile[]
} & ButtonProps

const SelectActivePlayerDropdown = ({
  players,
  className,
  variant = "ghost",
  size = "icon",
  children,
  ...props
}: SelectActivePlayerDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("p-1 gap-x-2 rounded-xl border-2 border-border/50", className)}
          variant={variant}
          size={size}
          {...props}
        >
          {children}
          <ChevronDown className="size-4 sm:size-5 text-muted-foreground"
            strokeWidth={3.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <SelectActivePlayerDropdownContent players={players} />
    </DropdownMenu>
  )
}

type SelectActivePlayerDropdownContentProps = {
  players: PlayerProfile[]
  asSub?: boolean
}

const SelectActivePlayerDropdownContent = ({ players, asSub = false }: SelectActivePlayerDropdownContentProps) => {
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  const DropdownContent = asSub ? DropdownMenuSubContent : DropdownMenuContent

  return (
    <DropdownContent>
      <DropdownMenuLabel className="flex items-center gap-x-1.5 font-normal">
        <UserRoundCheck className="size-4" strokeWidth={2.25} />
        <span>Select a player</span>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      {players.map((player) => (
        <DropdownMenuItem className="focus:bg-transparent/5 dark:focus:bg-transparent/35"
          onClick={() => handleSelectAsActive(player)}
          disabled={selectAsActive.isPending}
          key={player.id}
        >
          <PlayerBadge className="flex-1" player={player} />
        </DropdownMenuItem>
      ))}
    </DropdownContent>
  )
}

export default SelectActivePlayerDropdown
export { SelectActivePlayerDropdownContent }
