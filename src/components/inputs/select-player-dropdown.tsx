"use client"

import { forwardRef } from "react"

// types
import type {
  DropdownMenuTriggerProps,
  Content as DropdownMenuPrimitiveContent,
  SubContent as DropdownMenuPrimitiveSubContent
} from "@radix-ui/react-dropdown-menu"

// utils
import { cn } from "@/lib/utils"

// icons
import { Hash, UserCheck2 } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerVerified } from "@/components/player"

type SelectPlayerInputProps = {
  players: ClientPlayer[]
  handleSelectPlayer: (player: ClientPlayer) => Promise<void> | void
  isPending?: boolean
}

type SelectPlayerDropdownProps = {
  children: React.ReactNode
} & SelectPlayerInputProps
  & Omit<DropdownMenuTriggerProps, 'children'>

const SelectPlayerDropdown = ({ players, handleSelectPlayer, isPending, children, ...props }: SelectPlayerDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} asChild>
        {children}
      </DropdownMenuTrigger>

      <SelectPlayerDropdownContent
        players={players}
        handleSelectPlayer={handleSelectPlayer}
        isPending={isPending}
      />
    </DropdownMenu>
  )
}

type SelectPlayerDropdownContentProps = {
  asSub?: boolean
} & SelectPlayerInputProps
  & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitiveContent | typeof DropdownMenuPrimitiveSubContent>

const SelectPlayerDropdownContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitiveContent | typeof DropdownMenuPrimitiveSubContent>,
  SelectPlayerDropdownContentProps
>(({ players, handleSelectPlayer, isPending = false, asSub = false }, ref) => {
  const DropdownContent = asSub ? DropdownMenuSubContent : DropdownMenuContent

  return (
    <DropdownContent ref={ref}>
      <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
        <div className="flex items-center gap-x-2">
          <Separator className="h-4 w-1 rounded-full bg-border/50"
            orientation="vertical"
          />

          <p className="pt-1 text-base font-normal font-heading tracking-wider">
            Select player
          </p>
        </div>

        <UserCheck2 className="size-[1.125rem]" strokeWidth={1.5} />
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      {players.map((player) => (
        <DropdownMenuItem
          variant="muted"
          onClick={() => handleSelectPlayer(player)}
          disabled={isPending}
          key={player.tag}
        >
          <Hash className="size-4"
            strokeWidth={2.5}
            style={{ color: player.color }}
          />

          <span className="mt-0.5">
            {player.tag}
          </span>

          <PlayerVerified className={cn("ml-auto", { "hidden": !player.isActive })} />
        </DropdownMenuItem>
      ))}
    </DropdownContent>
  )
})
SelectPlayerDropdownContent.displayName = "SelectPlayerDropdownContent"

export default SelectPlayerDropdown
export { SelectPlayerDropdownContent }
