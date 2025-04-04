"use client"

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

const CollectionQuickSetupLink = ({
  collectionId,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: CollectionQuickSetupLinkProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const settings = useCacheStore<SessionFormFilter, "cache">((state) => state.cache)

  const handleNavigate = () => {
    /*
     * Note: In this case, a full page reload is needed to make sure closing the popup.
     * Yeah, this is a disgusting solution, but I couldn't find a better approach.
     */
    if (pathname === "/collections/explorer") {
      const searchParams = new URLSearchParams({ ...settings, collectionId })
      const url = `/game/setup?${searchParams.toString()}`

      router.back()
      if (settings?.collectionId !== collectionId) {
        window.location.replace(url)
      }
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
      {...props}
    >
      <ImagePlay className="size-5 sm:size-[1.325rem]"
        strokeWidth={2.5}
      />
    </Button>
  )
}

export default CollectionQuickSetupLink
