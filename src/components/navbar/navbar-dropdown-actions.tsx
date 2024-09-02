// clerk
import { SignedIn, SignOutButton } from "@clerk/nextjs"

// trpc
import { api } from "@/trpc/server"

// icons
import { ChevronDown, Gamepad2, LogOut, Plus, UserCog } from "lucide-react"

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

const NavbarActions = async () => {
  const user = await api.user.getWithPlayerProfiles()

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

        {user && (user.playerProfiles.length || 0) > 1 && (
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
                  {user.playerProfiles.map((player) => (
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

        <DropdownMenuSeparator className="2xl:hidden" />

        <DropdownMenuItem className="xl:hidden" variant="secondary">
          <Plus className="size-4" strokeWidth={3} />
          <span className="text-muted-foreground group-focus:text-secondary-foreground">
            Create new player
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className="2xl:hidden" variant="secondary">
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

export default NavbarActions
