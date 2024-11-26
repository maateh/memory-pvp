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
import {
  useDeletePlayerMutation,
  useSelectAsActiveMutation,
  useUpdatePlayerMutation
} from "@/lib/react-query/mutations/player"

type PlayerActionsDropdownProps = {
  player: ClientPlayer
  editing: boolean
  toggleEditing: () => void
} & React.ComponentProps<typeof DropdownMenuTrigger>

const PlayerActionsDropdown = ({ player, editing, toggleEditing, ...props }: PlayerActionsDropdownProps) => {
  const router = useRouter()

  const { updatePlayer } = useUpdatePlayerMutation()
  const { deletePlayer } = useDeletePlayerMutation()
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild {...props} />

      <DropdownMenuContent>
        <DropdownMenuItem
          variant="muted"
          onClick={toggleEditing}
          disabled={updatePlayer.isPending || deletePlayer.isPending}
        >
          {!editing ? (
            <>
              <UserPen className="size-4" />
              <span>Edit player</span>
            </>
          ) : (
            <>
              <PenOff className="size-4" />
              <span>Cancel editing</span>
            </>
          )}
        </DropdownMenuItem>

        {!player.isActive && (
          <>
            <DropdownMenuItem
              variant="accent"
              onClick={() => handleSelectAsActive(player)}
              disabled={selectAsActive.isPending || deletePlayer.isPending}
            >
              {selectAsActive.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldPlus className="size-4" />
              )}
              <span>Select as active</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => router.push(`/players/${player.tag}/delete`)}
              disabled={deletePlayer.isPending || updatePlayer.isPending || selectAsActive.isPending}
            >
              {deletePlayer.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Delete player</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlayerActionsDropdown
