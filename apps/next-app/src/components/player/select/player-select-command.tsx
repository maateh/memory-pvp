"use client"

import Link from "next/link"

// types
import type { ClientPlayer } from "@/lib/types/client"

// utils
import { cn } from "@/lib/util"

// icons
import { Hash, UserRoundPlus } from "lucide-react"

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CardItem } from "@/components/shared"
import { PlayerVerified } from "@/components/player"

// hooks
import { useSelectAsActiveAction } from "@/lib/safe-action/player"

type PlayerSelectCommandProps = {
  players: ClientPlayer[]
  showPopupLink?: boolean
  listProps?: React.ComponentProps<typeof CommandList>
} & React.ComponentProps<typeof Command>

const PlayerSelectCommand = ({ players, showPopupLink = false, listProps, ...props }: PlayerSelectCommandProps) => {
  const { execute: executeSelectAsActive, status: selectAsActiveStatus } = useSelectAsActiveAction()

  return (
    <Command {...props}>
      <CommandInput placeholder="Search player..." />

      <CommandSeparator className="w-4/5 mx-auto mt-1.5 mb-0.5 bg-border/10" />

      <CommandList {...listProps}>
        <CommandEmpty className="mt-2 text-sm text-muted-foreground font-light">
          <CardItem className="py-2 justify-center">
            No player found.
          </CardItem>
        </CommandEmpty>

        {players.length > 0 && (
          <CommandGroup heading="Players">  
            {players.map((player) => (
              <CommandItem className="my-0.5 cursor-pointer"
                value={player.tag}
                onSelect={() => executeSelectAsActive(player.tag)}
                disabled={selectAsActiveStatus === 'executing'}
                key={player.tag}
              >
                <Hash className="size-4"
                  strokeWidth={2.5}
                  style={{ color: player.color }}
                />
  
                <span className="mt-0.5">
                  {player.tag}
                </span>
  
                {player.isActive && (
                  <PlayerVerified className="ml-auto" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showPopupLink && (
          <>
            <CommandSeparator className="w-4/5 mx-auto my-1.5 bg-border/25" />

            <CommandGroup heading="Create">
              <CommandItem className="cursor-pointer" asChild>
                <Link href="/players/select" scroll={false}>
                  <UserRoundPlus className="size-4" />
                  <span>
                    Add new player
                  </span>
                </Link>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}

type PlayerSelectCommandSkeletonProps = {
  listProps?: React.ComponentProps<"ul">
} & React.ComponentProps<"div">

const PlayerSelectCommandSkeleton = ({ listProps, className, ...props }: PlayerSelectCommandSkeletonProps) => {
  return (
    <div className={cn("px-8", className)} {...props}>
      <Skeleton className="w-full h-11 px-3 bg-muted-foreground/15 rounded-2xl" />

      <Separator className="w-4/5 mx-auto my-3 bg-border/10" />

      <ul {...listProps}
        className={cn("space-y-2 px-4 max-h-80 overflow-y-auto overflow-x-hidden", listProps?.className)}
      >
        {Array(3).fill('').map((_, index) => (
          <Skeleton className="w-full h-7 bg-muted-foreground/25 rounded-lg" key={index} />
        ))}
      </ul>
    </div>
  )
}

export default PlayerSelectCommand
export { PlayerSelectCommandSkeleton }
