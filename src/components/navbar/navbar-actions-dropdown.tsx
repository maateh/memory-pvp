"use client"

import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// clerk
import { SignedIn, SignOutButton } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

// icons
import { ChevronDown, Gamepad2, LogOut, Plus, UserCircle, UserCircle2, UserCog } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"

// components
import { SelectActivePlayerDropdownContent } from "@/components/player"

type NavbarActionsDropdownProps = {
  players: PlayerProfile[]
}

const NavbarActionsDropdown = ({ players }: NavbarActionsDropdownProps) => {
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
        <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
          <div className="flex items-center gap-x-2">
            <Separator className="h-4 w-1 rounded-full bg-border/50"
              orientation="vertical"
            />

            <p className="pt-1 text-base font-normal font-heading tracking-wider">
              Player profile
            </p>
          </div>

          <UserCircle className="size-4" strokeWidth={1.5} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator className={cn({ "2xl:hidden": players.length === 0 })} />

        <DropdownMenuItem className={cn("2xl:hidden", {
          "lg:hidden": players.length === 0
        })}
          variant="secondary"
          onClick={() => router.push('/dashboard/sessions', { scroll: false })}
        >
          <Gamepad2 className="size-4" />
          <span>Game sessions</span>
        </DropdownMenuItem>

        <DropdownMenuItem className={cn("xl:hidden", {
          "hidden": players.length === 0
        })}
          variant="secondary"
          onClick={() => router.push('/profile/players', { scroll: false })}
        >
          <Plus className="size-4" />
          <span>New player</span>
        </DropdownMenuItem>

        {players.length > 1 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-x-2">
                <UserCog className="size-4" />
                <span>Switch player</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <SelectActivePlayerDropdownContent players={players} asSub />
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

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

export default NavbarActionsDropdown
