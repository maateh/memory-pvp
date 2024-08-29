import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, Spade } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

type LogoProps = {
  withLabel?: boolean
  withRedirect?: boolean
} & LucideProps

const Logo = ({ withLabel, withRedirect, className, strokeWidth = 2.35, ...props }: LogoProps) => {
  const icon = (
    <Spade className={cn("size-6", className)}
      strokeWidth={strokeWidth}
      {...props}
    />
  )

  if (!withLabel) {
    return withRedirect
      ? <Link href="/">{icon}</Link>
      : icon
  }

  const element = (
    <div className="flex items-center gap-x-2.5">
      {icon}

      <Separator className="h-6 bg-foreground/20"
        orientation="vertical"
      />

      <p className="text-2xl font-semibold">
        memory/pvp
      </p>
    </div>
  )

  if (!withRedirect) {
    return element
  }

  return (
    <Link className="w-fit" href="/">
      {element}
    </Link>
  )
}

export default Logo
