"use client"

import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// clerk
import { SignedIn, SignOutButton } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

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
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// components
import { ThemeToggle } from "@/components/shared"

// hooks
import { SelectActivePlayerDropdownContent } from "../player/select-active-player-dropdown"

type NavbarDropdownActionsProps = {
  players: PlayerProfile[]
}

const NavbarDropdownActions = ({ players }: NavbarDropdownActionsProps) => {
  const router = useRouter()

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
                <SelectActivePlayerDropdownContent players={players} asSub />
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
          onClick={() => router.push('/profile/players', { scroll: false })}
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
          onClick={() => router.push('/dashboard/sessions', { scroll: false })}
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
