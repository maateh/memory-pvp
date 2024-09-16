"use client"

import dynamic from "next/dynamic"

// components
const GameOfflineInitialize = dynamic(() => import("./initialize-offline-game"), { ssr: false })

const GamePlayOfflinePage = () => <GameOfflineInitialize />

export default GamePlayOfflinePage
