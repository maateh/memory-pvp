// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { formatDistance } from "date-fns"
import { cn } from "@/lib/util"

type CustomDateProps = {
  date: Date
  Icon: LucideIcon
  iconProps?: LucideProps
} & React.ComponentProps<"div">

const CustomDate = ({ date, Icon, iconProps, className, ...props }: CustomDateProps) => {
  return (
    <div className={cn("flex items-center gap-x-2 text-foreground/85 text-xs", className)} {...props}>
      <Icon {...iconProps}
        className={cn("size-3.5 shrink-0", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.25}
      />

      <span>
        {formatDistance(date, Date.now(), { addSuffix: true })}
      </span>
    </div>
  )
}

export default CustomDate
