import dynamic from "next/dynamic"

// components
import { PopupLoader } from "@/components/popup"

export default dynamic(() => import("./offline-session-warning"), {
  ssr: false,
  loading: PopupLoader
})
