"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// lib
import { cn } from "@/lib/utils"

// icons
import { CheckCircle2, Edit, ShieldCheck, Star, Trash2, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// components
import { CustomTooltip } from "@/components/shared"
import { ColorPicker } from "@/components/inputs"

type PlayerProfileCardProps = {
  player: PlayerProfile
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const router = useRouter()
  const utils = api.useUtils()

  const [editing, setEditing] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [color, setColor] = useState(player.color)

  const updatePlayer = api.playerProfile.update.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()
      setEditing(false)

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: (err) => {
      console.log({err})
      console.log(JSON.parse(err.message))
      // TODO: add toast
    }
  })

  const handleUpdatePlayer = async () => {
    const playerTag = inputRef.current?.value || ''

    if (playerTag === player.tag && color === player.color) {
      setEditing(false)
    }

    try {
      await updatePlayer.mutateAsync({
        id: player.id,
        color,
        playerTag
      })
    } catch (err) {
      throw new TRPCClientError('Failed to edit player profile.', { cause: err as Error })
    }
  }

  return (
    <div className="py-2.5 px-3 flex justify-between items-center rounded-lg hover:bg-transparent/5 dark:hover:bg-transparent/20">
      <div className="flex gap-x-3 items-center">
        <div className={cn("p-1.5 flex items-center justify-center rounded-xl", {
          "bg-transparent/5 dark:bg-transparent/20 border border-border/25": editing
        })}>
          <ColorPicker className="size-4 border"
            value={color}
            onChange={setColor}
            disabled={!editing}
          />
        </div>

        <div className="leading-snug">
          <div className="flex items-center gap-x-2">
            {editing ? (
              <Input className="h-fit py-0.5 mb-0.5 border-input/40"
                defaultValue={player.tag}
                ref={inputRef}
              />
            ) : (
              <p className="font-light">
                {player.tag}
              </p>
            )}

            {player.isActive && (
              <CustomTooltip tooltip={(
                <div className="flex items-center gap-x-2">
                  <ShieldCheck className="size-5 text-secondary" />
                  <p>Selected as <span className="text-accent font-semibold">active</span></p>
                </div>
              )}>
                <ShieldCheck className="size-4 text-secondary" />
              </CustomTooltip>
            )}
          </div>

          <div className="flex items-center gap-x-1.5 text-sm font-extralight small-caps">
            <Star className="size-3.5" />
            <span>Total score - {player.totalScore} points</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2.5">
        {editing ? (
          <>
            <ButtonTooltip className="p-1"
              tooltip="Save changes"
              variant="ghost"
              size="icon"
              onClick={handleUpdatePlayer}
              disabled={updatePlayer.isPending}
            >
              <CheckCircle2 className="size-5 text-accent" />
            </ButtonTooltip>

            <ButtonTooltip className="p-1"
              tooltip="Cancel"
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(false)
                setColor(player.color)
              }}
              disabled={updatePlayer.isPending}
            >
              <XCircle className="size-5 text-destructive" />
            </ButtonTooltip>
          </>
        ) : (
          <>
            <ButtonTooltip className="p-1.5"
              tooltip="Edit player profile"
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
            >
              <Edit className="size-5" />
            </ButtonTooltip>

            <ButtonTooltip className="p-1.5"
              tooltip="Delete player profile"
              variant="destructive"
              size="icon"
              onClick={() => {}}
            >
              <Trash2 className="size-4" />
            </ButtonTooltip>
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerProfileCard
