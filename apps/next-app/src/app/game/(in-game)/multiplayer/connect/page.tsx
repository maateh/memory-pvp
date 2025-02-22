import dynamic from "next/dynamic"

// components
import { SessionLoader } from "@/components/session/ingame"

export default dynamic(() => import("./room-loader"), {
  ssr: false,
  loading: SessionLoader
})
