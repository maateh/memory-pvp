// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { GameSessionPlayerInfo } from "@/components/game"

const GameSessionInfoFooter = () => {
  return (
    <div className="w-full min-h-14 mx-auto py-3 px-6 flex items-center justify-center gap-x-6 bg-secondary md:rounded-t-xl md:w-[44rem] lg:w-[52rem]">
      <GameSessionPlayerInfo
        playerName="playername"
        userAvatar=""
        overallScore={1500}
        sessionScore={10}
      />

      <Separator className="w-1.5 h-8 bg-secondary-foreground/80 rounded-full"
        orientation="vertical"
      />

      <GameSessionPlayerInfo
        playerName="playername2"
        userAvatar=""
        overallScore={800}
        sessionScore={5}
        flipOrder
      />
    </div>
  )
}

export default GameSessionInfoFooter
