"use client"

// icons
import { ChevronsUpDown } from "lucide-react"

// shadcn
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

// components
import { SelectPlayerDropdown } from "@/components/inputs"
import { PlayerBadge } from "@/components/player"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type PlayerSwitcherProps = {
  players: ClientPlayer[]
  activePlayer?: ClientPlayer
}

const PlayerSwitcher = ({ players, activePlayer }: PlayerSwitcherProps) => {
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        Active Player
      </SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>

            </DropdownMenuTrigger>

            <SelectPlayerDropdown
              players={players}
              handleSelectPlayer={handleSelectAsActive}
              isPending={selectAsActive.isPending}
            >
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              >
                {activePlayer && <PlayerBadge player={activePlayer} />}
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </SelectPlayerDropdown>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default PlayerSwitcher
