// components
import { GameActionBar, GameSessionInfoFooter } from "@/components/game"

const GameSessionLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-x-0">
        <GameActionBar />
      </div>

      {children}

      <div className="absolute bottom-0 inset-x-0">
        <GameSessionInfoFooter />
      </div>
    </div>
  )
}

export default GameSessionLayout
