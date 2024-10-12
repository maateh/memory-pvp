// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { SessionInfoBadge } from "@/components/session"

const SessionBasics = ({ type, mode, tableSize }: Pick<ClientGameSession, "type" | "mode" | "tableSize">) => {
  return (
    <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1">
      <SessionInfoBadge
        Icon={Gamepad2}
        label={gameTypePlaceholders[type].label}
        subLabel={gameModePlaceholders[mode].label}
      />

      <SessionInfoBadge
        Icon={Dices}
        label={tableSizePlaceholders[tableSize].label}
        subLabel={tableSizePlaceholders[tableSize].size}
      />
    </div>
  )
}

export default SessionBasics
