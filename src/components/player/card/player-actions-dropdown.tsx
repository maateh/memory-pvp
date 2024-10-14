"use client"

import { useState } from "react"

// prisma
import type { PlayerProfile } from "@prisma/client"

// utils
import { cn } from "@/lib/utils"

// icons
import { EllipsisVertical, Loader2, PenOff, ShieldPlus, Trash2, UserCog, UserPen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// components
import PlayerDeleteWarning from "./player-delete-warning"

// hooks
import {
  useDeletePlayerMutation,
  useSelectAsActiveMutation,
  useUpdatePlayerMutation
} from "@/lib/react-query/mutations/player"

type PlayerActionsDropdownProps = {
  player: PlayerProfile
  editing: boolean
  toggleEditing: () => void
}

const PlayerActionsDropdown = ({ player, editing, toggleEditing }: PlayerActionsDropdownProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false)

  const { updatePlayer } = useUpdatePlayerMutation()
  const { deletePlayer } = useDeletePlayerMutation()
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="p-1 sm:p-1.5"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical className="size-3.5 sm:size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
            <div className="flex items-center gap-x-2">
              <Separator className="h-4 w-1 rounded-full bg-border/50"
                orientation="vertical"
              />

              <p className="pt-0.5 text-base font-normal font-heading tracking-wider">
                Manage player
              </p>
            </div>

            <UserCog className="size-4" strokeWidth={1.5} />
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

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

          <DropdownMenuItem className={cn({ "hidden": player.isActive })}
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

          <DropdownMenuSeparator className={cn({ "hidden": player.isActive })} />

          <DropdownMenuItem className={cn({ "hidden": player.isActive })}
            variant="destructive"
            onClick={() => setShowDeleteWarning(true)}
            disabled={deletePlayer.isPending || updatePlayer.isPending || selectAsActive.isPending}
          >
            {deletePlayer.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            <span>Delete player</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PlayerDeleteWarning
        player={player}
        open={showDeleteWarning}
        onOpenChange={() => setShowDeleteWarning(false)}
      />
    </>
  )
}

export default PlayerActionsDropdown
