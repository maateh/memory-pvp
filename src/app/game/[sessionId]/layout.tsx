// components
import { GameActionBar, GameSessionFooter } from "@/components/game"

const GameSessionLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-screen w-full mx-auto flex flex-col items-center gap-y-4 bg-foreground/5 md:max-w-screen-lg lg:max-w-screen-xl">
      <GameActionBar />

      <div className="flex-1">
        {children}
      </div>

      <GameSessionFooter />
    </div>
  )
}

export default GameSessionLayout
