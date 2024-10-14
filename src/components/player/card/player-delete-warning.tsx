"use client"

import { useMemo } from "react"

// types
import type { PlayerProfile } from "@prisma/client"
import type { DialogProps } from "@radix-ui/react-dialog"
import type { Statistic } from "@/components/shared/statistics"

// icons
import { Hash, Star, Timer } from "lucide-react"

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
  player: PlayerProfile
} & DialogProps

const PlayerDeleteWarning = ({ player, ...props }: PlayerDeleteWarningProps) => {
  const { deletePlayer, handleDeletePlayer } = useDeletePlayerMutation()

  const stats = useMemo<Statistic[]>(() => ([
    {
      Icon: Hash,
      label: "Player Tag",
      data: player.tag
    },
    {
      Icon: Star,
      label: "Total Score",
      data: "50 points" // TODO: GET -> Total score
    },
    {
      Icon: Timer,
      label: "Playtime",
      data: "1h 30sec" // TODO: GET -> Total playtime
    }
  ]), [player])

  return (
    <WarningModal
      title="Delete player profile"
      description="Are you sure you want to delete this player profile?"
      {...props}
    >
      <StatisticList className="max-w-md mx-auto">
        {stats.map((stat) => (
          <StatisticItem className="min-w-32 max-w-40 px-3 py-1.5 text-sm sm:text-sm"
            iconProps={{ className: "size-4 sm:size-5" }}
            dataProps={{ className: "text-xs" }}
            statistic={stat}
            key={stat.label}
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
