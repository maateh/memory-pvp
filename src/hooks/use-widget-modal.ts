// zustand
import { create } from "zustand"

export type WidgetKey = "manageAccount" | "playerProfiles"

export type WidgetData = {
  title: string
  description?: string
  icon?: React.ReactNode
}

type ModalStore = {
  content: React.ReactNode
  isOpen: boolean
  openModal: (widgetKey: WidgetKey, data?: WidgetData) => void
  closeModal: () => void
}

type WidgetStore = {
  widgetKey: WidgetKey | null
  data: WidgetData
} & ModalStore

const DEFAULT_WIDGET_DATA: WidgetData = {
  title: ''
}

export const useWidgetModal = create<WidgetStore>((set) => ({
  widgetKey: null,
  data: DEFAULT_WIDGET_DATA,
  content: '',
  isOpen: false,
  openModal: (widgetKey, data = DEFAULT_WIDGET_DATA) => set({ widgetKey, data, isOpen: true }),
  closeModal: () => set({ widgetKey: null, isOpen: false })
}))
