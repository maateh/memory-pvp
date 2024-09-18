import dynamic from "next/dynamic"

// components
const OfflineGameHandler = dynamic(() => import("./offline-game-handler"), { ssr: false })

const GamePlayOfflinePage = () => <OfflineGameHandler />

export default GamePlayOfflinePage
