import Link from "next/link"

// types
import type { VariantProps } from "class-variance-authority"
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Expand } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

type WidgetLinkProps = {
  href: string
  iconProps?: LucideProps
} & VariantProps<typeof buttonVariants> & React.ComponentProps<typeof Link>

const WidgetLink = ({
  href,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  scroll = false,
  ...props
}: WidgetLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link className={cn(buttonVariants({
            className: cn("bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground", className),
            variant,
            size
          }))}
            href={href}
            scroll={scroll}
            {...props}
          >
            <Expand {...iconProps}
              className={cn("size-3.5 sm:size-4", iconProps?.className)}
              strokeWidth={iconProps?.strokeWidth || 2.25}
            />
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          Open page
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default WidgetLink
