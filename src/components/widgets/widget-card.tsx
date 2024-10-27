import Link from "next/link"

// types
import type { WidgetProps } from "@/components/widgets/types"

// utils
import { cn } from "@/lib/utils"

// icons
import { Edit, Expand } from "lucide-react"

// shadcn
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// components
import { WidgetHeader } from "@/components/widgets"

type WidgetCardProps = WidgetProps & React.ComponentProps<typeof Card>

const WidgetCard = ({
  widgetKey, title, description, iconProps, widgetAction, widgetLink,
  className, children, ...props
}: WidgetCardProps) => {
  return (
    <Card className={cn("bg-primary/10 dark:bg-primary/20", className)}
      {...props}
    >
      <CardHeader className="mt-4">
        <div className="flex items-center justify-between gap-5">
          <WidgetHeader
            type="card"
            widgetKey={widgetKey}
            title={title}
          />

          {widgetAction && (
            <Button className="expandable bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground"
              variant="ghost"
              size="icon"
              onClick={widgetAction}
            >
              <div className="mr-1 space-x-1.5">
                <Edit className="size-3" />
                <span>Manage</span>
              </div>

              <Expand className="size-5"
                strokeWidth={2.25}
              />
            </Button>
          )}

          {widgetLink && (
            <Link className={cn(buttonVariants({
              className: "expandable bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground",
              variant: "ghost",
              size: "icon"
            }))}
              href={widgetLink}
              scroll={false}
            >
              <div className="mr-1 space-x-1.5">
                <Edit className="size-3" />
                <span>Open</span>
              </div>

              <Expand className="size-5"
                strokeWidth={2.25}
              />
            </Link>
          )}
        </div>

        <CardDescription className={cn("font-extralight text-base", { 'sr-only': !description })}>
          {description || `${title} widget`}
        </CardDescription>
      </CardHeader>

      {children && (
        <>
          <Separator className="w-1/3 mx-auto mt-0.5 mb-2 bg-border/25" />

          <CardContent>
            {children}
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default WidgetCard
