// icons
import { Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { ThemeToggle } from "@/components/shared"

const GameActionBar = () => {
  return (
    <div className="w-full min-h-14 mx-auto py-3 px-5 flex items-center justify-between bg-primary sm:rounded-b-2xl sm:max-w-lg md:max-w-xl">
      <Button className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
        variant="ghost"
        size="icon"
      >
        <Menu className="size-5" />
      </Button>

      <p className="text-lg">Timer</p>

      <ThemeToggle className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
        variant="ghost"
      />
    </div>
  )
}

export default GameActionBar
