// utils
import { cn } from "@/lib/util"

type GlowingOverlayProps = {
  overlayProps?: React.ComponentProps<"div">
} & React.ComponentProps<"div">

const GlowingOverlay = ({
  overlayProps,
  className,
  children,
  ...props
}: GlowingOverlayProps) => {
  return (
    <div className={cn("relative group transition-all duration-300 hover:scale-105", className)} {...props}>
      {children}

      {/* Glowing overlay */}
      <div {...overlayProps}
        className={cn("absolute -inset-y-1.5 size-full rounded-full opacity-50 blur-lg bg-secondary", overlayProps?.className)}
      />
    </div>
  )
}

export default GlowingOverlay
