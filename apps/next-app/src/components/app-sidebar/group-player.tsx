import { Suspense } from "react"

// db
import { getPlayers } from "@/server/db/query/player-query"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

// components
import { Await } from "@/components/shared"
import { PlayerSelectButton } from "@/components/player/select"

const GroupPlayer = () => {
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
            <Suspense fallback={<Skeleton className="h-10 w-full bg-muted-foreground/25" />}>
              <Await promise={getPlayers()}>
                {(players) => (
                  <PlayerSelectButton className="w-full px-2 border border-sidebar-border/15 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent/80 dark:hover:text-sidebar-accent-foreground/80"
                    players={players}
                  />
                )}
              </Await>
            </Suspense>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default GroupPlayer
