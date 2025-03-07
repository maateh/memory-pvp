"use client"

import { useState } from "react"

// utils
import { cn } from "@/lib/util"

type HoverActionOverlayProps = {
  hoverAction?: () => void
  disableOverlay?: boolean
  overlayProps?: React.ComponentProps<"div">
} & React.ComponentProps<"div">

const HoverActionOverlay = ({
  hoverAction,
  disableOverlay = false,
  overlayProps,
  className,
  ...props
}: HoverActionOverlayProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const childrenElement = (
    <div className={cn("p-4", {
      "filter blur-sm": isHovered && !disableOverlay
    }, className)} {...props} />
  )

  if (disableOverlay) return childrenElement
  return (
    <div className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {childrenElement}

      {/* Hover Overlay */}
      <div {...overlayProps}
        className={cn("rounded-3xl absolute inset-0 flex items-center justify-center bg-black/30 bg-opacity-70 text-white transition-opacity duration-300 ease-in-out cursor-pointer", {
          "opacity-50": isHovered,
          "opacity-0 pointer-events-none": !isHovered
        }, overlayProps?.className)}
        onClick={hoverAction}
      />
    </div>
  )
}

export default HoverActionOverlay
