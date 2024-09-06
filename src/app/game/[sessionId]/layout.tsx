// components
import { GameActionBar, GameSessionFooter } from "@/components/game"

const GameSessionLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-4 bg-foreground/10 rounded-xl">
      <GameActionBar />

      <div className="flex-1">
        {children}
      </div>

      <GameSessionFooter />
    </div>
  )
}

export default GameSessionLayout
