import { cn } from "@/lib/util"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-400", className)}
      {...props}
    />
  )
}

export { Skeleton }
