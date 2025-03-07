// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type WidgetCardProps = {
  title: string
  description: string
  Icon: LucideIcon
  iconProps?: LucideProps
  contentProps?: Omit<React.ComponentProps<typeof CardContent>, 'children'>
} & React.ComponentProps<typeof Card>

const WidgetCard = ({
  title,
  description,
  Icon,
  iconProps,
  contentProps,
  className,
  children,
  ...props
}: WidgetCardProps) => {
  return (
    <Card className={cn("relative flex flex-col pt-4 bg-primary/20", className)} {...props}>
      <CardHeader>
        <div className="flex-1 flex gap-x-3 sm:gap-x-4">
          <Icon className="size-5 sm:size-6 shrink-none" />

          <CardTitle className="text-xl sm:text-2xl font-heading heading-decorator">
            {title}
          </CardTitle>
        </div>

        <CardDescription className="font-light">
          {description}
        </CardDescription>
      </CardHeader>

      <Separator className="w-4/5 mx-auto mt-1 mb-4 bg-border/15" />

      <CardContent {...contentProps}
        className={cn("flex-1 flex flex-col", contentProps?.className)}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export default WidgetCard
