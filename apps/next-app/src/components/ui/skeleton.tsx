import { cn } from "@/lib/util"

const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={cn("animate-pulse rounded-lg bg-gray-400", className)}
    data-slot="skeleton"
    {...props}
  />
)

export { Skeleton }
