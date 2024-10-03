// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizeMap } from "@/constants/game"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"

const SessionBasics = ({ type, mode, tableSize }: Pick<ClientGameSession, "type" | "mode" | "tableSize">) => {
  return (
    <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1">
      <Badge className="py-0.5 gap-x-2 bg-secondary/20 hover:bg-secondary/30 text-foreground"
        variant="accent"
      >
        <Gamepad2 className="size-4" strokeWidth={1.75} />

        <p className="pt-0.5 text-sm font-heading capitalize">
          <span className="font-medium small-caps">
            {gameTypePlaceholders[type].label}
          </span> / <span className="text-foreground/85 small-caps">
            {gameModePlaceholders[mode].label}
          </span>
        </p>
      </Badge>

      <Badge className="py-0.5 gap-x-2 bg-secondary/20 hover:bg-secondary/30 text-foreground"
        variant="accent"
      >
        <Dices className="size-4" strokeWidth={1.75} />

        <p className="space-x-1 pt-0.5 text-sm font-heading">
          <span className="font-medium capitalize small-caps">
            {tableSize.toLowerCase()}
          </span>
          <span className="text-xs text-muted-foreground">
            ({tableSizeMap[tableSize]} cards)
          </span>
        </p>
      </Badge>
    </div>
  )
}

export default SessionBasics
