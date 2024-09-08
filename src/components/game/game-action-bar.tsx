// components
import { ThemeToggle } from "@/components/shared"
import { GameActionsDropdown } from "@/components/game"

const GameActionBar = () => {
  return (
    <div className="w-full min-h-14 mx-auto py-3 px-1.5 flex items-center justify-between bg-primary sm:px-5 sm:rounded-b-2xl sm:max-w-lg md:max-w-xl">
      <GameActionsDropdown />

      <p className="text-lg">Timer</p>

      <ThemeToggle className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
        variant="ghost"
      />
    </div>
  )
}

export default GameActionBar
