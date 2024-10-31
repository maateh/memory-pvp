// utils
import { cn } from "@/lib/utils"

const LayoutCard = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("p-6 pt-8 bg-primary/30 hover:bg-primary/35 rounded-3xl shadow-xl hover:shadow-2xl hover:drop-shadow-sm transition duration-300", className)} {...props} />
  )
}

export default LayoutCard
