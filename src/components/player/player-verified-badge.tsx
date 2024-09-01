// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, ShieldCheck } from "lucide-react"

// components
import { CustomTooltip } from "@/components/shared"

const PlayerVerifiedBadge = ({ className, ...props }: LucideProps) => {
  return (
    <CustomTooltip tooltip={(
      <div className="flex items-center gap-x-2">
        <ShieldCheck className="size-5 text-secondary" />
        
        <p className="font-light">
          Selected as <span className="text-accent font-semibold">active</span> player profile
        </p>
      </div>
    )}>
      <ShieldCheck className={cn("size-4 text-secondary", className)}
        {...props}
      />
    </CustomTooltip>
  )
}

export default PlayerVerifiedBadge
