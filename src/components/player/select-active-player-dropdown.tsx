"use client"

import { forwardRef } from "react"

// types
import type { PlayerProfile } from "@prisma/client"
import type {
  Content as DropdownMenuPrimitiveContent,
  SubContent as DropdownMenuPrimitiveSubContent
} from "@radix-ui/react-dropdown-menu"

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
} & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitiveContent | typeof DropdownMenuPrimitiveSubContent>

const SelectActivePlayerDropdownContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitiveContent | typeof DropdownMenuPrimitiveSubContent>,
  SelectActivePlayerDropdownContentProps
>(({ players, asSub = false }, ref) => {
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  const DropdownContent = asSub ? DropdownMenuSubContent : DropdownMenuContent

  return (
    <DropdownContent ref={ref}>
      <DropdownMenuLabel className="flex items-center gap-x-4 font-normal">
        <span className="pt-1 text-base font-heading">
          Select a player
        </span>

        <UserRoundCheck className="size-4" />
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
})
SelectActivePlayerDropdownContent.displayName = "SelectActivePlayerDropdownContent"

export default SelectActivePlayerDropdown
export { SelectActivePlayerDropdownContent }
