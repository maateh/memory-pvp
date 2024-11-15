import Link from "next/link"

// icons
import { Gamepad2 } from "lucide-react"

// shadcn
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

const NavGame = () => {
  return (
    <SidebarGroup className="group-data-[state=expanded]:px-6 group-data-[mobile=true]:px-6">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="py-5 font-heading group-data-[state=expanded]:justify-center group-data-[mobile=true]:justify-center"
            variant="outline"
            tooltip="Start new game"
            asChild
          >
            <Link href="/game/setup">
              <Gamepad2 strokeWidth={2.25} />
              <span className="mt-1">Start new game</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavGame
