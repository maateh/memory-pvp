// icons
import { ChevronDown, LogOut, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "../shared"

const NavbarActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1"
          variant="ghost"
          size="icon"
        >
          <ChevronDown className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center justify-between">
          <p className="text-base font-semibold small-caps">
            Actions
          </p>

          <ThemeToggle className="p-1.5"
            variant="ghost"
            iconProps={{ className: "size-4" }}
          />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-x-1.5">
            <Plus className="size-4 text-accent" />
            Create new player
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-x-1.5 text-destructive focus:bg-destructive focus:text-destructive-foreground">
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavbarActions
