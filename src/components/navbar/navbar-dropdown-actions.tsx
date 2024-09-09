"use client"

// prisma
import { PlayerProfile } from "@prisma/client"

// clerk
import { SignedIn, SignOutButton } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

// icons
import { ChevronDown, Gamepad2, LogOut, Plus, UserCog, UserRoundCheck } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// components
import { ThemeToggle } from "@/components/shared"
import { PlayerBadge } from "@/components/player"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type NavbarDropdownActionsProps = {
  players: PlayerProfile[]
}

const NavbarDropdownActions = ({ players }: NavbarDropdownActionsProps) => {
  const openWidgetModal = useWidgetModal((state) => state.openModal)

  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1"
          variant="ghost"
          size="icon"
        >
          <ChevronDown className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center justify-between">
          <p className="text-base font-semibold small-caps">
            Actions
          </p>

          <ThemeToggle className="p-1.5"
            variant="ghost"
            iconProps={{ className: "size-4" }}
          />
        </DropdownMenuLabel>

        {players.length > 1 && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <div className="flex items-center gap-x-2">
                  <UserCog className="size-4" strokeWidth={3} />
                  <span>Switch player</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
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
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator className={cn("2xl:hidden", {
          "lg:hidden": players.length === 0
        })} />

        <DropdownMenuItem className={cn("xl:hidden", {
          "hidden": players.length === 0
        })}
          variant="secondary"
          onClick={() => openWidgetModal('playerProfiles')}
        >
          <Plus className="size-4" strokeWidth={3} />
          <span className="text-muted-foreground group-focus:text-secondary-foreground">
            Create new player
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className={cn("2xl:hidden", {
          "lg:hidden": players.length === 0
        })}
          variant="secondary"
          onClick={() => openWidgetModal('gameSessions')}
        >
          <Gamepad2 className="size-4" strokeWidth={2.75} />
          <span className="text-muted-foreground group-focus:text-secondary-foreground">
            Game sessions
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignedIn>
          <SignOutButton>
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </SignOutButton>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavbarDropdownActions
