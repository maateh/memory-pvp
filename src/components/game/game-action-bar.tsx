// icons
import { Menu } from "lucide-react"

// components
import { ThemeToggle } from "@/components/shared"

const GameActionBar = () => {
  return (
    <div className="w-full min-h-14 mx-auto py-3 px-6 flex items-center justify-between bg-secondary sm:rounded-b-xl sm:w-[32rem] md:w-[36rem]">
      <Menu className="size-5 cursor-pointer hover:bg-accent-foreground/5" />

      <div>Timer</div>

      <ThemeToggle className="p-1.5 hover:bg-accent-foreground/5"
        variant="ghost"
        iconProps={{ className: "size-3.5" }}
      />
    </div>
  )
}

export default GameActionBar
