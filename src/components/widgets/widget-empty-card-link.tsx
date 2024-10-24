import Link from "next/link"

// types
import type { WidgetProps } from "@/components/widgets/types"

// constants
import { widgetIconMap } from "@/components/widgets/constants"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"

type WidgetEmptyCardLinkProps = WidgetProps & React.ComponentProps<typeof Link>

const WidgetEmptyCardLink = ({
  widgetKey, description, iconProps,
  href, scroll = false, className, children, ...props
}: WidgetEmptyCardLinkProps) => {
  const Icon = widgetIconMap[widgetKey]

  return (
    <Link className={cn("px-4 py-8 flex flex-col items-center justify-center rounded-2xl text-center bg-primary/25 border-2 border-input/25 border-dashed transition hover:bg-primary/35 shadow-md hover:shadow-lg dark:drop-shadow-xl hover:dark:shadow-xl", className)}
      href={href}
      scroll={scroll}
      {...props}
    >
      {children || (
        <>
          <Button className="mb-2 p-2"
            variant="ghost"
            size="icon"
          >
            <Icon {...iconProps}
              className={cn("size-6 mx-auto text-accent sm:size-8", iconProps?.className)}
            />
          </Button>

          <p className="font-heading font-medium dark:font-light">
            {description}
          </p>
        </>
      )}
    </Link>
  )
}

export default WidgetEmptyCardLink
