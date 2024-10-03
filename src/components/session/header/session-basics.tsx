// constants
import { tableSizeMap } from "@/constants/game"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"

const SessionBasics = ({ type, mode, tableSize }: Pick<ClientGameSession, "type" | "mode" | "tableSize">) => {
  return (
    <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1">
      <Badge className="py-0.5 gap-x-1"
        variant="secondary"
      >
        <Gamepad2 className="size-4" strokeWidth={1.75} />

        <p className="pt-0.5 text-sm font-heading capitalize">
          <span className="font-bold tracking-wide small-caps">
            {type.toLowerCase()}
          </span> | <span className="font-semibold">
            {mode.toLowerCase()}
          </span>
        </p>
      </Badge>

      <Badge className="py-0.5 gap-x-1"
        variant="accent"
      >
        <Dices className="size-4" strokeWidth={1.75} />

        <p className="space-x-1 pt-0.5 text-sm font-heading">
          <span className="font-bold tracking-wide capitalize small-caps">
            {tableSize.toLowerCase()}
          </span>
          <span className="text-xs font-medium">
            ({tableSizeMap[tableSize]} cards)
          </span>
        </p>
      </Badge>
    </div>
  )
}

export default SessionBasics
