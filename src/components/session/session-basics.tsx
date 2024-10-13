// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// types
import type { LucideProps } from "lucide-react"
import type { BadgeProps } from "@/components/ui/badge"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { SessionInfoBadge } from "@/components/session"

type SessionBasicsProps = {
  session: Pick<ClientGameSession, "type" | "mode" | "tableSize">
  iconProps?: LucideProps
  badgeProps?: BadgeProps
}

const SessionBasics = ({ session, iconProps, badgeProps }: SessionBasicsProps) => {
  const { type, mode, tableSize } = session

  return (
    <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1">
      <SessionInfoBadge {...badgeProps}
        Icon={Gamepad2}
        iconProps={iconProps}
        label={gameTypePlaceholders[type].label}
        subLabel={gameModePlaceholders[mode].label}
      />

      <SessionInfoBadge {...badgeProps}
        Icon={Dices}
        iconProps={iconProps}
        label={tableSizePlaceholders[tableSize].label}
        subLabel={tableSizePlaceholders[tableSize].size}
      />
    </div>
  )
}

export default SessionBasics