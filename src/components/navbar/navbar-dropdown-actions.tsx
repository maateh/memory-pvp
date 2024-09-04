// prisma
import { PlayerProfile } from "@prisma/client"

// clerk
import { SignedIn, SignOutButton } from "@clerk/nextjs"

// icons
import { ChevronDown, Gamepad2, LogOut, Plus, UserCog } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

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

type NavbarDropdownActionsProps = {
  players: PlayerProfile[]
}

const NavbarDropdownActions = ({ players }: NavbarDropdownActionsProps) => {
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
                  {players.map((player) => (
                    <DropdownMenuItem className="focus:bg-transparent/5 dark:focus:bg-transparent/35"
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
