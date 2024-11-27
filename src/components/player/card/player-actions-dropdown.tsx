"use client"

import { useRouter } from "next/navigation"

// icons
import { Loader2, PenOff, ShieldPlus, Trash2, UserPen } from "lucide-react"

// shadcn
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
} & React.ComponentProps<typeof DropdownMenuTrigger>

const PlayerActionsDropdown = ({ player, editing, toggleEditing, ...props }: PlayerActionsDropdownProps) => {
  const router = useRouter()

  const { execute: executeSelectAsActive, status: selectAsActiveStatus } = useSelectAsActiveAction()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild {...props} />

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

            <DropdownMenuItem
              variant="destructive"
              onClick={() => router.push(`/players/${player.tag}/delete`)}
            >
              <Trash2 className="size-4 shrink-0" />
              <span>Delete player</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlayerActionsDropdown
