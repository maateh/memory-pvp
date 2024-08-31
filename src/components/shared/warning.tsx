// utils
import { cn } from "@/lib/utils"

// icons
import { AlertTriangle, LucideProps } from "lucide-react"

type WarningProps = {
  message: string
  messageProps?: React.HTMLAttributes<HTMLParagraphElement>
  iconProps?: LucideProps
  className?: string
}

const Warning = ({ message, messageProps, iconProps, className }: WarningProps) => {
  return (
    <div className={cn("mt-2 text-center flex flex-wrap justify-center items-center gap-2.5", className)}>
      <AlertTriangle {...iconProps}
        className={cn("size-5 text-destructive/80 flex-none", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.5}
      />

      <p {...messageProps}
        className={cn("text-destructive text-sm font-semibold font-mono", messageProps?.className)}
      >
        {message}
      </p>
    </div>
  )
}

export default Warning
