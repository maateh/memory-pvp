// icons
import { Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { ThemeToggle } from "@/components/shared"

const GameActionBar = () => {
  return (
    <div className="w-full min-h-14 mx-auto py-3 px-5 flex items-center justify-between bg-primary/85 sm:rounded-b-xl sm:w-[32rem] md:w-[36rem]">
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
