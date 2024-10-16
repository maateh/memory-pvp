"use client"

import { useMemo } from "react"

// types
import type { DialogProps } from "@radix-ui/react-dialog"

// utils
import { getPlayerStatsMap } from "@/lib/utils/stats"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import {
  StatisticItem,
  StatisticList,
  WarningActionButton,
  WarningCancelButton,
  WarningModal,
  WarningModalFooter
} from "@/components/shared"

// hooks
import { useDeletePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerDeleteWarningProps = {
  player: ClientPlayer
} & DialogProps

const PlayerDeleteWarning = ({ player, ...props }: PlayerDeleteWarningProps) => {
  const { deletePlayer, handleDeletePlayer } = useDeletePlayerMutation()

  const stats = useMemo(() => getPlayerStatsMap(player, ['tag', 'score', 'timer']), [player])
  
  return (
    <WarningModal
      title="Delete player profile"
      description="Are you sure you want to delete this player profile?"
      {...props}
    >
      <StatisticList className="max-w-md mx-auto">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="min-w-32 max-w-40 px-3 py-1.5 text-sm sm:text-sm"
            iconProps={{ className: "size-4 sm:size-5" }}
            dataProps={{ className: "text-xs" }}
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>

      <Separator className="w-1/5 mx-auto bg-border/15" />

      <WarningModalFooter>
        <WarningCancelButton onClick={() => props.onOpenChange && props.onOpenChange(false)}>
          Cancel
        </WarningCancelButton>

        <WarningActionButton
          onClick={() => handleDeletePlayer({
            player,
            closeDialog: () => props.onOpenChange
          })}
          disabled={deletePlayer.isPending}
        >
          Delete
        </WarningActionButton>
      </WarningModalFooter>
    </WarningModal>
  )
}

export default PlayerDeleteWarning
