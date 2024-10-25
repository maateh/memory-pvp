// types
import type { LucideIcon, LucideProps } from "lucide-react"

export type WidgetKey = "_" | "statistics" | "rooms" | "history" | "collectionUpload" | "collectionManage" | "account" | "players"

export type WidgetIconMap = {
  [key in WidgetKey]: LucideIcon | undefined
}

export type WidgetInfo<K extends WidgetKey = WidgetKey> = {
  widgetKey: K
  title: string
  description?: string
}

export type WidgetProps = WidgetInfo & {
  iconProps?: LucideProps
} & ({
  widgetAction?: () => void
  widgetLink?: never
} | {
  widgetLink?: string
  widgetAction?: never
})
