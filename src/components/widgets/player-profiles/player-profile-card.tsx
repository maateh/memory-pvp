"use client"

import { useRef, useState } from "react"

// prisma
import { PlayerProfile } from "@prisma/client"

// lib
import { cn } from "@/lib/utils"

// icons
import { CheckCircle2, Edit, ShieldCheck, ShieldPlus, Star, Trash2, XCircle } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// components
import { CustomTooltip } from "@/components/shared"
import { ColorPicker } from "@/components/inputs"

// hooks
import { useDeletePlayer, useSelectAsActive, useUpdatePlayer } from "./queries"

type PlayerProfileCardProps = {
  player: PlayerProfile
}

const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const [editing, setEditing] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [color, setColor] = useState(player.color)

  const { updatePlayer, handleUpdatePlayer } = useUpdatePlayer({
    player,
    updatedPlayer: {
      tag: inputRef.current?.value || '',
      color
    },
    setEditing
  })

  const { deletePlayer, handleDeletePlayer } = useDeletePlayer({ player })
  const { selectAsActive, handleSelectAsActive } = useSelectAsActive({ player })

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
            {!player.isActive && (
              <ButtonTooltip className="p-1"
                tooltip={(
                  <div className="flex items-center gap-x-2">
                    <ShieldPlus className="size-4" />
                    <p>
                      Select as <span className="text-accent font-medium">active</span>
                    </p>
                  </div>
                )}
                variant="ghost"
                size="icon"
                onClick={handleSelectAsActive}
                disabled={selectAsActive.isPending || deletePlayer.isPending}
              >
                <ShieldPlus className="size-4 text-muted-foreground" />
              </ButtonTooltip>
            )}

            <ButtonTooltip className="p-1.5"
              tooltip="Edit player profile"
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
              disabled={updatePlayer.isPending || deletePlayer.isPending}
            >
              <Edit className="size-5" />
            </ButtonTooltip>

            {!player.isActive && (
              <ButtonTooltip className="p-1.5"
                tooltip="Delete player profile"
                variant="destructive"
                size="icon"
                onClick={handleDeletePlayer} // TODO: show confirm before deletion
                disabled={deletePlayer.isPending || updatePlayer.isPending}
              >
                <Trash2 className="size-4" />
              </ButtonTooltip>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerProfileCard
