"use client"

import Link from "next/link"

// types
import type { ClientPlayer } from "@/lib/schema/player-schema"

// utils
import { cn } from "@/lib/util"

// icons
import { EllipsisVertical, Loader2, ShieldPlus, Trash2, UserPen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// hooks
import { useSelectAsActiveAction } from "@/lib/safe-action/player"

type PlayerActionsDropdownProps = {
  player: ClientPlayer
} & React.ComponentProps<typeof Button>

const PlayerActionsDropdown = ({
  player,
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: PlayerActionsDropdownProps) => {
  const {
    execute: executeSelectAsActive,
    status: selectAsActiveStatus
  } = useSelectAsActiveAction()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("p-1 sm:p-1.5", className)}
          variant={variant}
          size={size}
          {...props}
        >
          <EllipsisVertical className="size-3.5 sm:size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem variant="muted" asChild>
          <Link href={`/players/${player.tag}/edit`}>
            <UserPen className="size-4 shrink-0" />
            <span>Edit player</span>
          </Link>
        </DropdownMenuItem>

        {!player.isActive && (
          <>
            <DropdownMenuItem
              variant="accent"
              onClick={() => executeSelectAsActive(player.tag)}
              disabled={selectAsActiveStatus === 'executing'}
            >
              {selectAsActiveStatus === 'executing' ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <ShieldPlus className="size-4 shrink-0" />
              )}
              <span>Select as active</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" asChild>
              <Link href={`/players/${player.tag}/delete`}>
                <Trash2 className="size-4 shrink-0" />
                <span>Delete player</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlayerActionsDropdown
