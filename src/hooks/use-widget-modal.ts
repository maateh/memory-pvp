// zustand
import { create } from "zustand"

export type WidgetKey = "" | "manageAccount" | "playerProfiles" | "gameSessions"

type WidgetModalStore = {
  widgetKey: WidgetKey
  isOpen: boolean
  openModal: (widgetKey: WidgetKey) => void
  closeModal: () => void
}

export const useWidgetModal = create<WidgetModalStore>((set) => ({
  widgetKey: '',
  isOpen: false,
  openModal: (widgetKey) => set({ widgetKey, isOpen: true }),
  closeModal: () => set({ widgetKey: '', isOpen: false })
}))
