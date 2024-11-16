import type { LucideProps } from "lucide-react"

export type WidgetKey = "statistics" | "rooms" | "sessions" | "players"

export type Widget = {
  key: WidgetKey
  title: string
  description: string
  href?: string
  iconProps?: LucideProps
  quickAccess?: () => void
}
