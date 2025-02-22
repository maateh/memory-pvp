import dynamic from "next/dynamic"

// components
import { SessionLoader } from "@/components/session/ingame"

export default dynamic(() => import("./multi-session-loader"), {
  ssr: false,
  loading: SessionLoader
})
