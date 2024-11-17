import Link from "next/link"

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

// components
import { CardItem } from "@/components/shared"
import { PlayerVerified } from "@/components/player"

type PlayerSelectCommandProps = {
  players: ClientPlayer[]
  isPending: boolean
  handleSelect: (player: ClientPlayer) => void
  showCreateButton?: boolean
  listProps?: React.ComponentProps<typeof CommandList>
} & React.ComponentProps<typeof Command>

const PlayerSelectCommand = ({
  players,
  isPending,
  handleSelect,
  showCreateButton = false,
  listProps,
  ...props
}: PlayerSelectCommandProps) => {
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
                onSelect={() => handleSelect(player)}
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
  
                {player.isActive && (
                  <PlayerVerified className="ml-auto" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showCreateButton && (
          <>
            <CommandSeparator className="w-4/5 mx-auto my-1.5 bg-border/25" />

            <CommandGroup heading="Create">
              <CommandItem className="cursor-pointer" asChild>
                <Link href="/dashboard/players" scroll={false}>
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

export default PlayerSelectCommand
