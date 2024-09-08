// components
import { GameActionBar } from "@/components/game"

const GamePlayLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-2 bg-foreground/10 rounded-xl">
      <GameActionBar />

      {children}
    </div>
  )
}

export default GamePlayLayout
