// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

type Statistic = {
  Icon: LucideIcon
  label: string
  data: string | number
}

const StatisticList = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("w-full flex flex-wrap justify-center gap-x-6 gap-y-3.5", className)}
    {...props}
  />
)

type StatisticItemProps = {
  statistic: Statistic
  iconProps?: LucideProps
  labelProps?: React.ComponentProps<"p">
  dataProps?: React.ComponentProps<"div">
} & React.ComponentProps<"li">

const StatisticItem = ({ statistic, iconProps, labelProps, dataProps, className, ...props }: StatisticItemProps) => {
  const { data, label, Icon } = statistic

  return (
    <li className={cn("group flex-1 px-4 py-2 flex justify-between items-center gap-x-3 bg-secondary/10 border border-border/35 rounded-xl transition hover:bg-secondary/20 dark:hover:bg-secondary/15 sm:text-lg", className)}
      {...props}
    >
      <div className="text-muted-foreground">
        <p {...labelProps}
          className={cn("font-heading", labelProps?.className)}
        >
          {label}
        </p>

        <div {...dataProps}
          className={cn("flex items-center gap-x-2 text-sm text-foreground/80 font-medium", dataProps?.className)}
        >
          <Separator className="h-4 w-1.5 bg-accent rounded-full"
            orientation="vertical"
          />
          <p>{data}</p>
        </div>
      </div>

      <Icon {...iconProps}
        className={cn("size-6 sm:size-7 flex-none text-muted-foreground/65 transition group-hover:text-muted-foreground/80 dark:group-hover:text-muted-foreground/75", iconProps?.className)}
      />
    </li>
  )
}

export {
  type Statistic,
  StatisticList,
  StatisticItem
}