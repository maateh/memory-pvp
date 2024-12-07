// types
import type { VariantProps } from "class-variance-authority"

// utils
import { cva } from "class-variance-authority"
import { cn } from "@/lib/util"

// icons
import { Hash } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"

// components
import { PlayerVerified } from "@/components/player"

const playerBadgeVariants = cva(
  "group flex items-center gap-x-1 font-heading dark:font-light transition-all drop-shadow-lg dark:drop-shadow-xl hover:drop-shadow-xl dark:hover:drop-shadow-2xl",
  {
    variants: {
      size: {
        default: "py-0 text-sm sm:text-base",
        sm: "py-0 px-2 text-xs font-medium dark:font-normal",
        lg: "py-0.5 text-sm sm:text-base"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

type PlayerBadgeProps = {
  player: Pick<ClientPlayer, 'tag' | 'color' | 'isActive'>
  hideVerified?: boolean
  showVerifiedTooltip?: boolean
} & React.ComponentProps<typeof Badge>
  & VariantProps<typeof playerBadgeVariants>

const PlayerBadge = ({
  player,
  hideVerified = false,
  showVerifiedTooltip = false,
  className,
  variant = "outline",
  size,
  ...props
}: PlayerBadgeProps) => {
  return (
    <Badge className={cn(playerBadgeVariants({ size }), className)}
      variant={variant}
      {...props}
    >
      <Hash className={cn("size-3 sm:size-3.5 transition group-hover:opacity-95", {
        "size-3": size === "sm",
        "size-3.5 sm:size-4": size === "lg"
      })}
        strokeWidth={2.5}
        style={{ color: player.color }}
      />

      <span className="mt-0.5">
        {player.tag}
      </span>

      <PlayerVerified className={cn("size-3 sm:size-3.5 ml-0.5", {
        "size-3": size === "sm",
        "size-3.5 sm:size-4": size === "lg",
        "hidden": hideVerified || !player.isActive
      })} showTooltip={showVerifiedTooltip} />
    </Badge>
  )
}

export default PlayerBadge
