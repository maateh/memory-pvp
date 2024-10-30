// utils
import { cn } from "@/lib/utils"

const LayoutCard = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("p-6 pt-8 bg-primary/60 hover:bg-primary/65 shadow-xl drop-shadow-md hover:shadow-2xl hover:drop-shadow-xl transition-all rounded-3xl duration-200", className)} {...props} />
  )
}

export default LayoutCard
