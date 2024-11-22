"use client"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type PopupHeaderProps = {
  title: string
  description: string
  titleProps?: React.ComponentProps<"h2">
  descriptionProps?: React.ComponentProps<"p">
} & React.ComponentProps<"div">

const PopupHeader = ({
  title,
  description,
  titleProps,
  descriptionProps,
  className,
  ...props
}: PopupHeaderProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerHeader className={cn("gap-y-0", className)} {...props}>
        <DrawerTitle {...titleProps}
          className={cn("mt-2 text-2xl font-heading heading-decorator", titleProps?.className)}
        >
          {title}
        </DrawerTitle>

        <DrawerDescription {...descriptionProps}
          className={cn("text-sm text-muted-foreground font-light", descriptionProps?.className)}
        >
          {description}
        </DrawerDescription>
      </DrawerHeader>
    )
  }

  return (
    <DialogHeader className={cn("gap-y-0", className)} {...props}>
      <DialogTitle {...titleProps}
        className={cn("text-2xl sm:text-3xl font-heading heading-decorator", titleProps?.className)}
      >
        {title}
      </DialogTitle>

      <DialogDescription {...descriptionProps}
        className={cn("font-light text-sm", descriptionProps?.className)}
      >
        {description}
      </DialogDescription>
    </DialogHeader>
  )
}

export default PopupHeader
