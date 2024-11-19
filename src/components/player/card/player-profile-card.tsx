"use client"

import { useMemo, useState } from "react"

// utils
import { cn } from "@/lib/utils"
import { getPlayerStatsMap } from "@/lib/utils/stats"

// icons
import { CheckCircle2, Hash, Loader2, XCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import { ColorPicker } from "@/components/inputs"
import { StatisticBadge } from "@/components/shared"
import { PlayerVerified } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

// hooks
import { useDeletePlayerMutation, useUpdatePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerProfileCardProps = {
  player: ClientPlayer
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState<boolean>(false)

  const [updatedPlayer, setUpdatedPlayer] = useState<Pick<ClientPlayer, 'tag' | 'color'>>({
    tag: player.tag,
    color: player.color
  })

  const playerStats = useMemo(() => getPlayerStatsMap(player, [
    'score', 'sessions', 'timer', 'flips', 'matches'
  ]), [player])

  const { updatePlayer, handleUpdatePlayer } = useUpdatePlayerMutation()
  const { deletePlayer } = useDeletePlayerMutation()

  const handleToggleEditing = () => {
    setEditing((editing) => {
      if (editing) setUpdatedPlayer(player)
      return !editing
    })
  }

  return (
    <>
      <div className="flex gap-x-3 items-center">
        <ColorPicker className={cn("border border-border/5 disabled:opacity-100", {
          "bg-foreground/5 border-2 border-border/20": editing
        })}
          value={updatedPlayer.color}
          onChange={(color) => setUpdatedPlayer((prev) => ({ ...prev, color }))}
          disabled={!editing}
        >
          <Hash className="size-4"
            style={{ color: updatedPlayer.color }}
            strokeWidth={editing ? 4 : 2.5}
          />
        </ColorPicker>

        <div className="leading-relaxed">
          <div className="flex items-center gap-x-2">
            <Separator className="w-1 h-4 bg-accent rounded-full" />

            {editing ? (
              <Input className="h-fit py-0.5 mb-0.5 border-input/40"
                value={updatedPlayer.tag}
                onChange={(e) => setUpdatedPlayer((prev) => ({ ...prev, tag: e.target.value }))}
              />
            ) : (
              <p className="font-heading font-semibold">
                {player.tag}
              </p>
            )}

            {player.isActive && <PlayerVerified showTooltip />}
          </div>

          <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {Object.values(playerStats).map((stat) => (
              <li key={stat.key}>
                <StatisticBadge className="px-1.5 dark:font-light bg-muted/50 text-foreground/80 hover:bg-muted/65 hover:text-foreground/90 rounded-xl"
                  statistic={stat}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-x-2.5">
        <div className={cn("flex gap-x-1", { "hidden": !editing })}>
          <Button className="p-1"
            tooltip="Save changes"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdatePlayer({
              player,
              updatedPlayer,
              resetEditing: () => setEditing(false)
            })}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            {updatePlayer.isPending ? (
              <Loader2 className="size-[1.125rem] text-accent animate-spin flex-none" />
            ) : (
              <CheckCircle2 className="size-[1.125rem] text-accent flex-none" />
            )}
          </Button>

          <Button className="p-1"
            tooltip="Cancel"
            variant="ghost"
            size="icon"
            onClick={handleToggleEditing}
            disabled={updatePlayer.isPending || deletePlayer.isPending}
          >
            <XCircle className="size-[1.125rem] text-destructive flex-none" />
          </Button>
        </div>

        <PlayerActionsDropdown
          player={player}
          editing={editing}
          toggleEditing={handleToggleEditing}
        />
      </div>
    </>
  )
}

export default PlayerProfileCard
