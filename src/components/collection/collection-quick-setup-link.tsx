"use client"

import Link from "next/link"
import { forwardRef } from "react"
import { usePathname, useRouter } from "next/navigation"

// utils
import { cn } from "@/lib/util"

// icons
import { ImagePlay } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type CollectionQuickSetupLinkProps = {
  collectionId: string
} & React.ComponentProps<typeof Button>

const CollectionQuickSetupLink = forwardRef<
  HTMLButtonElement,
  CollectionQuickSetupLinkProps
>(({
  collectionId,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}, ref) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Button className={cn("transition duration-200 hover:scale-110", className)}
      tooltip={{
        children: "Start game with this collection",
        side: "bottom",
        align: "center"
      }}
      variant={variant}
      size={size}
      ref={ref}
      asChild
      {...props}
    >
      <Link
        href={`/game/setup?collection=${collectionId}`}
        /* Note: Close popup first */
        onClick={pathname === '/collections/explorer' ? router.back : undefined}
      >
        <ImagePlay className="size-4 sm:size-[1.325rem]"
          strokeWidth={2.5}
        />
      </Link>
    </Button>
  )
})
CollectionQuickSetupLink.displayName = "CollectionQuickSetupLink"

export default CollectionQuickSetupLink
