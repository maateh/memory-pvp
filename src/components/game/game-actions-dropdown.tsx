"use client"

import { useRouter } from "next/navigation"

// icons
import { DoorOpen, Gamepad, Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const GameActionsDropdown = () => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
          variant="ghost"
          size="icon"
        >
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-x-2">
          <Gamepad className="size-5" />
          <span>Game actions</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive"
          onClick={() => router.push('/')} // TODO: handle exit game
        >
          <DoorOpen className="size-4" />
          <span>Exit game</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GameActionsDropdown
