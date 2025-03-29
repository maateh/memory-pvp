"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner className="group toaster"
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "group toast flex gap-x-2 bg-background/95 text-foreground border-border rounded-2xl shadow-lg",
          content: "flex-1",
          description: "text-muted-foreground",
          success: "data-[type=success]:text-accent data-[type=success]:border-accent/90",
          error: "data-[type=error]:text-destructive data-[type=error]:border-destructive/90",
          warning: "data-[type=warning]:text-yellow-600 data-[type=warning]:border-yellow-600/90 dark:data-[type=warning]:text-yellow-200 dark:data-[type=warning]:border-yellow-200/90",
          actionButton: "data-[action=true]:group-[.toast]:px-3.5 data-[action=true]:group-[.toast]:py-4 data-[action=true]:group-[.toast]:bg-primary data-[action=true]:group-[.toast]:text-primary-foreground data-[action=true]:group-[.toast]:font-semibold data-[action=true]:group-[.toast]:tracking-wide data-[action=true]:group-[.toast]:rounded-lg hover:data-[action=true]:group-[.toast]:bg-primary/80",
          cancelButton: "data-[cancel=true]:group-[.toast]:p-3.5 data-[cancel=true]:group-[.toast]:bg-muted/60 data-[cancel=true]:group-[.toast]:text-foreground/90 data-[cancel=true]:group-[.toast]:rounded-lg hover:data-[cancel=true]:group-[.toast]:bg-muted/75"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
