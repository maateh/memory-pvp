"use client"

import { useTheme } from "next-themes"

// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, Moon, Sun } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ThemeToggleProps = ButtonProps & {
  iconProps?: LucideProps
}

const ThemeToggle = ({
  iconProps,
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ThemeToggleProps) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("rounded-2xl", className)}
          variant={variant}
          size={size}
        >
          <Sun {...iconProps}
            className={cn("size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
              iconProps?.className
            )}
          />

          <Moon {...iconProps}
            className={cn("absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
              iconProps?.className
            )}
          />

          <span className="sr-only">
            Toggle theme
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
