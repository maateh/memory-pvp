"use client"

import Link from "next/link"

// icons
import { EllipsisVertical, Loader2, PenOff, ShieldPlus, Trash2, UserPen } from "lucide-react"

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
  editing: boolean
  toggleEditing: () => void
}

const PlayerActionsDropdown = ({ player, editing, toggleEditing }: PlayerActionsDropdownProps) => {
  const { execute: executeSelectAsActive, status: selectAsActiveStatus } = useSelectAsActiveAction()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1 sm:p-1.5"
          variant="ghost"
          size="icon"
        >
          <EllipsisVertical className="size-3.5 sm:size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          variant="muted"
          onClick={toggleEditing}
        >
          {!editing ? (
            <>
              <UserPen className="size-4 shrink-0" />
              <span>Edit player</span>
            </>
          ) : (
            <>
              <PenOff className="size-4 shrink-0" />
              <span>Cancel editing</span>
            </>
          )}
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
