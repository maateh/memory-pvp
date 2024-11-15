// shadcn
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

// components
import { PlayerSelectButton } from "@/components/player/select"

type PlayerSwitcherProps = {
  players: ClientPlayer[]
}

const GroupPlayer = ({ players }: PlayerSwitcherProps) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        Active Player
      </SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
          >
            <PlayerSelectButton className="border border-sidebar-border/15 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent/80 dark:hover:text-sidebar-accent-foreground/80"
              players={players}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default GroupPlayer
