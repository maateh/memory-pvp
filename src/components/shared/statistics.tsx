import { cva, VariantProps } from "class-variance-authority"

// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const StatisticList = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("w-full flex flex-wrap justify-center gap-x-6 gap-y-3.5", className)}
    {...props}
  />
)

const statVariants = cva(
  "group flex-1 flex justify-between items-center gap-x-3 border border-border/35 rounded-xl transition",
  {
    variants: {
      variant: {
        default: "bg-secondary/10 hover:bg-secondary/20 dark:hover:bg-secondary/15",
        destructive: "bg-destructive/10 hover:bg-destructive/20 dark:hover:bg-destructive/15"
      },
      size: {
        default: "px-4 py-2 text-base sm:text-lg",
        sm: "px-3 py-1.5 text-sm sm:text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

type StatisticItemProps = {
  statistic: RendererStat | (Omit<RendererStat, 'data'> & { data: React.ReactNode })
  iconProps?: LucideProps
  labelProps?: React.ComponentProps<"p">
  dataProps?: React.ComponentProps<"div">
} & React.ComponentProps<"li">
  & VariantProps<typeof statVariants>

const StatisticItem = ({
  statistic,
  iconProps, labelProps, dataProps,
  className, variant, size, ...props
}: StatisticItemProps) => {
  const { data, label, Icon } = statistic

  return (
    <li className={cn(statVariants({ variant, size }), className)} {...props}>
      <div className="text-muted-foreground">
        <p {...labelProps}
          className={cn("font-heading", labelProps?.className)}
        >
          {label}
        </p>

        <div {...dataProps}
          className={cn("flex items-center gap-x-2 text-sm text-foreground/80 font-medium", {
            "text-xs": size === 'sm'
          }, dataProps?.className)}
        >
          <Separator className={cn("h-4 w-1.5 bg-accent rounded-full", {
            "bg-destructive": variant === 'destructive'
          })} orientation="vertical" />

          {typeof data === 'object' ? data : <p>{data}</p>}
        </div>
      </div>

      <Icon {...iconProps}
        className={cn("size-6 sm:size-7 flex-none text-muted-foreground/65 transition group-hover:text-muted-foreground/80 dark:group-hover:text-muted-foreground/75", {
          "size-4 sm:size-5": size === 'sm'
        }, iconProps?.className)}
      />
    </li>
  )
}

type StatisticBadgeProps = {
  showLabel?: boolean
  iconProps?: LucideProps
  labelProps?: React.ComponentProps<"span">
  dataProps?: React.ComponentProps<"span">
} & Omit<React.ComponentProps<typeof Badge>, 'children'>
  & ({
    statistic: RendererStat
    Icon?: never
    children?: never
  } | {
    statistic?: never
    Icon: LucideIcon
    children: React.ReactNode
  })

const StatisticBadge = ({
  statistic,
  showLabel = false,
  Icon,
  iconProps,
  labelProps,
  dataProps,
  className,
  children,
  ...props
}: StatisticBadgeProps) => {
  const StatIcon = Icon || statistic.Icon

  return (
    <Badge className={cn("py-1 gap-x-1.5 font-normal tracking-wide", className)} {...props}>
      <StatIcon {...iconProps}
        className={cn("size-4 flex-none", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 1.75}
      />

      {children || (
        <div className="flex items-center gap-x-1">
          {showLabel && (
            <>
              <span {...labelProps}>{statistic?.label}</span>
              <span className="font-semibold">|</span>
            </>
          )}

          <span {...dataProps}
            className={cn("font-semibold dark:font-medium", dataProps?.className)}
          >
            {statistic?.data}
          </span>
        </div>
      )}
    </Badge>
  )
}

export {
  StatisticList,
  StatisticItem,
  StatisticBadge
}
