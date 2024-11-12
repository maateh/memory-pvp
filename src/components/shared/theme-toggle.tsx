"use client"

import { forwardRef } from "react"
import { useTheme } from "next-themes"

// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, Moon, Sun } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type ThemeToggleProps = {
  expandable?: "right" | "left" | "none"
  iconProps?: LucideProps
} & Omit<React.ComponentProps<typeof Button>, 'onClick'>

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(({
  expandable = "none",
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}, ref) => {
  const { theme, setTheme } = useTheme() as UseThemeProps

  return (
    <Button className={cn("flex items-center gap-x-1 bg-foreground/5 rounded-2xl", {
      "expandable": expandable !== 'none',
      "flex-row-reverse expandable-left": expandable === 'left'
    }, className)}
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      ref={ref}
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
})
ThemeToggle.displayName = "ThemeToggle"

export default ThemeToggle
