"use client"

import { forwardRef } from "react"
import { usePathname, useRouter } from "next/navigation"

// types
import type { SessionFormFilter } from "@repo/schema/session"

// utils
import { cn } from "@/lib/util"

// icons
import { ImagePlay } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

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

  const search = useCacheStore<SessionFormFilter, "cache">((state) => state.cache)

  const handleNavigate = () => {
    /*
     * Note: In this case, a full page reload is needed to make sure closing the popup.
     * Yeah, this is a disgusting solution, but I couldn't find a better approach.
     */
    if (pathname === "/collections/explorer") {
      const searchParams = new URLSearchParams({ ...search, collectionId })
      const url = `/game/setup?${searchParams.toString()}`

      router.back()
      window.location.replace(url)
      return
    }

    router.push(`/game/setup?collectionId=${collectionId}`)
  }

  return (
    <Button className={cn("transition duration-200 hover:scale-110", className)}
      tooltip={{
        children: "Start game with this collection",
        side: "bottom",
        align: "center"
      }}
      variant={variant}
      size={size}
      onClick={handleNavigate}
      ref={ref}
      {...props}
    >
      <ImagePlay className="size-5 sm:size-[1.325rem]"
        strokeWidth={2.5}
      />
    </Button>
  )
})
CollectionQuickSetupLink.displayName = "CollectionQuickSetupLink"

export default CollectionQuickSetupLink
