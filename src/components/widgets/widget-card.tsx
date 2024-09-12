import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

// types
import type { WidgetInfo } from "@/components/widgets/types"

// icons
import { Edit, Expand } from "lucide-react"

// shadcn
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type WidgetCardProps = ({
  widgetAction: () => void
  widgetLink?: never
} | {
  widgetLink: string
  widgetAction?: never
}) & { className?: string }
  & WidgetInfo
  & React.PropsWithChildren

const WidgetCard = ({
  title,
  description,
  icon,
  widgetAction,
  widgetLink,
  className,
  children
}: WidgetCardProps) => {
  return (
    <Card className={cn("bg-primary/10 dark:bg-primary/20 border-0 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-xl dark:drop-shadow-xl hover:dark:shadow-2xl transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1 flex gap-x-4">
            {icon && (
              <div className="size-6 sm:size-7 shrink-0">
                {icon}
              </div>
            )}

            <CardTitle className="text-2xl sm:text-3xl font-heading heading-decorator">
              {title}
            </CardTitle>
          </div>

          {widgetAction ? (
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
          ) : (
            <Link className={cn(buttonVariants({
              className: "expandable bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground",
              variant: "ghost",
              size: "icon"
            }))}
              href={widgetLink}
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
