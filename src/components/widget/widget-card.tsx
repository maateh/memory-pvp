// utils
import { cn } from "@/lib/utils"

// icons
import { Expand, LucideIcon } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type WidgetCardProps = {
  widgetKey: string
  title: string
  description?: string
  Icon?: LucideIcon
  className?: string
} & React.PropsWithChildren

const WidgetCard = ({ title, description, Icon, className, children }: WidgetCardProps) => {
  // TODO: add zustand to handle modals based on the given widget key

  return (
    <Card className={cn("bg-primary/10 dark:bg-primary/20 border-0 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-xl dark:drop-shadow-xl hover:dark:shadow-2xl transition-shadow", className)}>
      <CardHeader className="mt-2">
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1 flex gap-x-4">
            {Icon && <Icon className="size-6 sm:size-7" />}

            <CardTitle className="text-2xl sm:text-3xl font-heading heading-decorator">
              {title}
            </CardTitle>
          </div>

          <Button className="bg-accent/10 hover:bg-accent/15 hover:text-foreground"
            variant="ghost"
            size="icon"
          >
            <Expand className="size-5"
              strokeWidth={2.25}
            />
          </Button>
        </div>

        <CardDescription className={cn("font-extralight text-base", { 'sr-only': !description })}>
          {description || `${title} widget`}
        </CardDescription>
      </CardHeader>

      {children && (
        <>
          <Separator className="w-1/3 mx-auto mt-1 mb-4 bg-border/10" />

          <CardContent>
            {children}
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default WidgetCard
