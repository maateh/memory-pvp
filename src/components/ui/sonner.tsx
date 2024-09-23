"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="group toaster"
      toastOptions={{
        classNames: {
          toast: "group toast flex gap-x-2 bg-background/95 text-foreground border-border rounded-2xl shadow-lg",
          content: "flex-1",
          description: "text-muted-foreground",
          success: "data-[type=success]:text-accent data-[type=success]:border-accent/90",
          error: "data-[type=error]:text-destructive data-[type=error]:border-destructive/90",
          warning: "data-[type=warning]:text-yellow-600 data-[type=warning]:border-yellow-600/90 dark:data-[type=warning]:text-yellow-200 dark:data-[type=warning]:border-yellow-200/90",
          actionButton: "group-[.toast]:data-[action=true]:px-3.5 group-[.toast]:data-[action=true]:py-4 group-[.toast]:data-[action=true]:bg-primary group-[.toast]:data-[action=true]:text-primary-foreground group-[.toast]:data-[action=true]:font-semibold group-[.toast]:data-[action=true]:tracking-wide group-[.toast]:data-[action=true]:rounded-lg group-[.toast]:data-[action=true]:hover:bg-primary/80",
          cancelButton: "group-[.toast]:data-[cancel=true]:p-3.5 group-[.toast]:data-[cancel=true]:bg-muted/60 group-[.toast]:data-[cancel=true]:text-foreground/90 group-[.toast]:data-[cancel=true]:rounded-lg group-[.toast]:data-[cancel=true]:hover:bg-muted/75"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
