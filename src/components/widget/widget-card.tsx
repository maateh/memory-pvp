import Link from "next/link"

// types
import type { Widget } from "@/components/widget/types"

// constants
import { widgetIconMap } from "@/constants/dashboard"

// utils
import { cn } from "@/lib/utils"

// icons
import { Expand } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type WidgetCardProps = {
  widget: Widget
  contentProps?: Omit<React.ComponentProps<typeof CardContent>, 'children'>
} & React.ComponentProps<typeof Card>

const WidgetCard = ({
  widget,
  contentProps,
  className,
  children,
  ...props
}: WidgetCardProps) => {
  const Icon = widgetIconMap[widget.key]

  return (
    <Card className={cn("bg-primary/10 dark:bg-primary/20", className)} {...props}>
      <CardHeader className="mt-4">
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1 flex gap-x-4">
            {Icon && <Icon className="size-6 sm:size-7 shrink-none" />}

            <CardTitle className="mt-1 text-2xl sm:text-3xl font-heading heading-decorator">
              {widget.title}
            </CardTitle>
          </div>

          {widget.href && (
            <Link className={cn(buttonVariants({
              className: "expandable bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground",
              variant: "ghost",
              size: "icon"
            }))}
              href={widget.href}
              scroll={false}
            >
              <div className="mr-1.5">
                <span className="font-normal">
                  Open
                </span>
              </div>
              <Expand className="size-5"
                strokeWidth={2.25}
              />
            </Link>
          )}
        </div>

        <CardDescription className="font-light">
          {widget.description}
        </CardDescription>
      </CardHeader>

      <Separator className="w-4/5 mx-auto mt-1 mb-4 bg-border/15" />

      <CardContent {...contentProps}>
        {children}
      </CardContent>
    </Card>
  )
}

export default WidgetCard
