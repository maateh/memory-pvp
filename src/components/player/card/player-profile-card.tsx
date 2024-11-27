"use client"

import { useMemo, useState } from "react"

// types
import type { SessionFilter } from "@/components/session/filter/types"

// trpc
import { api } from "@/trpc/client"

// utils
import { cn, logError } from "@/lib/utils"
import { getPlayerStatsMap } from "@/lib/utils/stats"

// icons
import { CheckCircle2, EllipsisVertical, Hash, Loader2, XCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { ColorPicker } from "@/components/inputs"
import { StatisticBadge } from "@/components/shared"
import { PlayerVerified } from "@/components/player"
import PlayerActionsDropdown from "./player-actions-dropdown"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"
import { useUpdatePlayerAction } from "@/lib/safe-action/player"

type PlayerProfileCardProps = {
  player: ClientPlayer
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [updatedPlayer, setUpdatedPlayer] = useState<Pick<ClientPlayer, 'tag' | 'color'>>({
    tag: player.tag,
    color: player.color
  })

  const filter = useFilterStore<SessionFilter>((state) => state.statistics)

  const { data: stats, isFetching: isStatsFetching } = api.player.getStats.useQuery({
    playerFilter: { id: player.id },
    sessionFilter: filter
  }, {
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const playerStats = useMemo(() => getPlayerStatsMap({
    ...player,
    stats: stats || player.stats
  }, ['score', 'sessions', 'timer', 'flips', 'matches']), [player, stats])

  const { executeAsync: executeUpdatePlayer, status: updatePlayerStatus } = useUpdatePlayerAction()

  const handleToggleEditing = () => {
    setEditing((editing) => {
      if (editing) setUpdatedPlayer(player)
      return !editing
    })
  }

  const handleExecute = async () => {
    try {
      await executeUpdatePlayer({
        previousTag: player.tag,
        ...updatedPlayer
      })
      setEditing(false)
    } catch (err) {
      logError(err)
    }
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
            <Separator className="w-1 h-4 rounded-full"
              style={{ backgroundColor: updatedPlayer.color }}
            />

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
            {!isStatsFetching ? Object.values(playerStats).map((stat) => (
              <li key={stat.key}>
                <StatisticBadge className="px-1.5 dark:font-light bg-muted/50 text-foreground/80 hover:bg-muted/65 hover:text-foreground/90 rounded-xl"
                  statistic={stat}
                />
              </li>
            )) : Array(5).fill('').map((_, index) => (
              <li key={index}>
                <Skeleton className="h-6 w-20 bg-muted/80 rounded-xl" />
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
            onClick={handleExecute}
            disabled={updatePlayerStatus === 'executing'}
          >
            {updatePlayerStatus === 'executing' ? (
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
            disabled={updatePlayerStatus === 'executing'}
          >
            <XCircle className="size-[1.125rem] text-destructive flex-none" />
          </Button>
        </div>

        <PlayerActionsDropdown
          player={player}
          editing={editing}
          toggleEditing={handleToggleEditing}
        >
          <Button className="p-1 sm:p-1.5"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical className="size-3.5 sm:size-4 shrink-0" />
          </Button>
        </PlayerActionsDropdown>
      </div>
    </>
  )
}

export default PlayerProfileCard
