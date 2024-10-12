// utils
import { cn } from "@/lib/utils"

const WidgetSubheader = ({ children, className, ...props }: React.ComponentProps<"h4">) => {
  return (
    <h4 className={cn("text-lg font-heading font-semibold small-caps heading-decorator subheading", className)}
      {...props}
    >
      {children}
    </h4>
  )
}

export default WidgetSubheader
