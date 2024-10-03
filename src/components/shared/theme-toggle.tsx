"use client"

import { useTheme } from "next-themes"

// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, Moon, Sun } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"

type ThemeToggleProps = {
  expandable?: boolean
  iconProps?: LucideProps
} & Omit<ButtonProps, 'onClick'>

const ThemeToggle = ({
  expandable = false,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme() as UseThemeProps

  return (
    <Button className={cn("bg-foreground/5 rounded-2xl", { "expandable": expandable }, className)}
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      {...props}
    >
      <Sun {...iconProps}
        className={cn("size-4 transition-all dark:hidden",
          iconProps?.className
        )}
        strokeWidth={2.8}
      />

      <Moon {...iconProps}
        className={cn("size-4 transition-all hidden dark:block",
          iconProps?.className
        )}
        strokeWidth={2.8}
      />

      <div className={cn({ "sr-only": !expandable })}>
        <p className="ml-1.5 text-xs font-extralight">
          Switch to <span className="font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </p>
      </div>
    </Button>
  )
}

export default ThemeToggle
