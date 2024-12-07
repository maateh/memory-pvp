// utils
import { cn } from "@/lib/util"

// icons
import { LucideProps, ShieldCheck } from "lucide-react"

// components
import { CustomTooltip } from "@/components/shared"

type PlayerVerifiedProps = {
  showTooltip?: boolean
} & LucideProps

const PlayerVerified = ({
  showTooltip = false,
  className, strokeWidth = "2.25", ...props
}: PlayerVerifiedProps) => {
  const verifiedIcon = (
    <ShieldCheck className={cn("size-4 flex-none text-secondary", className)}
      strokeWidth={strokeWidth}
      {...props}
    />
  )

  if (!showTooltip) {
    return verifiedIcon
  }

  return (
    <CustomTooltip tooltip={(
      <div className="flex items-center gap-x-2">
        <ShieldCheck className="size-4 text-secondary" />
        
        <p className="font-body font-light dark:font-extralight">
          Selected as <span className="text-accent font-medium">active</span> player profile
        </p>
      </div>
    )}>
      {verifiedIcon}
    </CustomTooltip>
  )
}

export default PlayerVerified
