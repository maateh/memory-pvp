import type { LucideIcon } from "lucide-react"
import type { ClientPlayer } from "@repo/schema/player"

export type RendererStat = {
  Icon: LucideIcon
  label: string
  data: string | number
}

export type RendererStatsMap<K extends string> = {
  [key in K]: {
    key: key
  } & RendererStat
}

export type RendererSessionStatKeys = 'typeMode' | 'tableSize' | 'timer' | 'matches' | 'flips' | 'startedAt'
export type RendererPlayerStatKeys = 'tag' | keyof ClientPlayer['stats']
