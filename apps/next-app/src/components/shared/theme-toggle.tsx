"use client"

import { useTheme } from "next-themes"

// types
import type { UseThemeProps } from "@/lib/types/theme"

// utils
import { cn } from "@/lib/util"

// icons
import { LucideProps, Moon, Sun } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type ThemeToggleProps = {
  showTooltip?: boolean
  expandable?: "right" | "left" | "none"
  iconProps?: LucideProps
} & Omit<React.ComponentProps<typeof Button>, 'onClick'>

const ThemeToggle = ({
  showTooltip = false,
  expandable = "none",
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme() as UseThemeProps

  return (
    <Button className={cn("flex items-center gap-x-1 bg-foreground/5 rounded-2xl", {
      "expandable": expandable !== 'none',
      "flex-row-reverse expandable-left": expandable === 'left'
    }, className)}
      tooltip={showTooltip ? `Switch to ${theme === 'light' ? 'Dark' : 'Light'}` : undefined}
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      {...props}
    >
      <Sun {...iconProps}
        className={cn("size-4 transition-all dark:hidden", iconProps?.className)}
        strokeWidth={2.8}
      />

      <Moon {...iconProps}
        className={cn("size-4 transition-all hidden dark:block", iconProps?.className)}
        strokeWidth={2.8}
      />

      <div className={cn({ "sr-only": expandable === 'none' })}>
        <p className="text-xs font-extralight">
          Switch to <span className="font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </p>
      </div>
    </Button>
  )
}

const ThemeToggleSkeleton = ({ className, ...props }: React.ComponentProps<typeof Skeleton>) => (
  <Skeleton className={cn("size-7 shrink-0 bg-border/50 rounded-xl", className)}
    {...props}
  />
)

export default ThemeToggle
export { ThemeToggleSkeleton }
