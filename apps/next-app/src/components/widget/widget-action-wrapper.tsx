// utils
import { cn } from "@/lib/util"

const WidgetActionWrapper = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("absolute top-6 right-6 flex items-center gap-x-3", className)}
      {...props}
    />
  )
}

export default WidgetActionWrapper
