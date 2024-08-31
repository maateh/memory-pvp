"use client"

import { useEffect } from "react"

// utils
import { cn } from "@/lib/utils"

// icons
import { Edit, Expand } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// hooks
import { useWidget, WidgetKey, WidgetStore } from "@/hooks/use-widget"

type WidgetCardProps<D> = {
  widgetKey: WidgetKey
  title: string
  description?: string
  icon?: React.ReactNode
  data?: D | null
  className?: string
} & React.PropsWithChildren

function WidgetCard<D>({
  widgetKey,
  title,
  description,
  icon,
  data,
  className,
  children
}: WidgetCardProps<D>) {
  const setWidgetData = useWidget<D, WidgetStore<D>['setData']>((state) => state.setData)
  const openModal = useWidget<D, WidgetStore<D>['openModal']>((state) => state.openModal)

  useEffect(() => {
    if (data) setWidgetData(data)
  }, [data, setWidgetData])

  return (
    <Card className={cn("bg-primary/10 dark:bg-primary/20 border-0 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-xl dark:drop-shadow-xl hover:dark:shadow-2xl transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1 flex gap-x-4">
            {icon && (
              <div className="size-6 sm:size-7">
                {icon}
              </div>
            )}

            <CardTitle className="text-2xl sm:text-3xl font-heading heading-decorator">
              {title}
            </CardTitle>
          </div>

          <Button className="expandable bg-accent/10 hover:bg-accent/15 dark:hover:bg-accent/15 hover:text-foreground"
            variant="ghost"
            size="icon"
            onClick={() => openModal(widgetKey, { title, description, icon })}
          >
            <div className="mr-1 space-x-1.5">
              <Edit className="size-3" />
              <span>Manage</span>
            </div>

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
