// types
import type { Card } from "@/components/ui/card"

// icons
import { Gamepad2 } from "lucide-react"

// components
import { PlayerProfileForm } from "@/components/player/form"
import { WidgetCard } from "@/components/widget"

const PlayerCreateWidgetCard = ({ ...props }: React.ComponentProps<typeof Card>) => {
  return (
    <WidgetCard
      title="Create player profile"
      description="You can have maximum of 5 player profiles added to your user account."
      Icon={Gamepad2}
      {...props}
    >
      <PlayerProfileForm />
    </WidgetCard>
  )
}

export default PlayerCreateWidgetCard
