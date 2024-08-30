// zustand
import { create } from "zustand"

export type WidgetKey = "manageAccount" | "playerProfiles"

type WidgetInfo = {
  title: string
  description?: string
  icon?: React.ReactNode
}

type ModalStore = {
  isOpen: boolean
  openModal: (widgetKey: WidgetKey, info?: WidgetInfo) => void
  closeModal: () => void
}

type WidgetStore<D> = {
  widgetKey: WidgetKey | null
  info: WidgetInfo
  data: D | null
  setData: (data: D) => void
} & ModalStore

const DEFAULT_WIDGET_INFO: WidgetInfo = {
  title: ''
}

const useWidgetImpl = create<WidgetStore<unknown>>((set) => ({
  widgetKey: null,
  info: DEFAULT_WIDGET_INFO,
  data: null,
  setData: (data) => set({ data }),
  isOpen: false,
  openModal: (widgetKey, info = DEFAULT_WIDGET_INFO) => set({ widgetKey, info, isOpen: true }),
  closeModal: () => set({ widgetKey: null, isOpen: false })
}))

export const useWidget = useWidgetImpl as {
  <D>(): WidgetStore<D>
  <D, U>(selector: (s: WidgetStore<D>) => U): U
}
