import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/util"

const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root className={cn("shrink-0 bg-border", {
    "h-[1px] w-full": orientation === "horizontal",
    "h-full w-[1px]": orientation === "vertical"
  }, className)}
    decorative={decorative}
    orientation={orientation}
    data-slot="separator"
    {...props}
  />
)

export { Separator }
