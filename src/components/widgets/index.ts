// types
import { LucideIcon } from "lucide-react"

export type WidgetInfo = {
  title: string
  description?: string
  Icon?: LucideIcon
}

export { default as WidgetCard } from "./widget-card"
export { default as WidgetModal } from "./widget-modal"
