"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import type { ClientCardCollection } from "@repo/schema/collection"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./table-columns"

// utils
import { cn } from "@/lib/util"

// icons
import { ImageOff, ImageUp } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table"

// components
import { NoListingData } from "@/components/shared"
import { CollectionCard, CollectionCardSkeleton } from "@/components/collection/listing"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type CollectionListingMetadata = {
  type: "listing" | "manage"
}

type CollectionListingProps = {
  collections: ClientCardCollection[]
  metadata: CollectionListingMetadata
  imageSize?: number
  fallbackType?: "default" | "redirect"
}

const CollectionListing = ({
  collections,
  metadata,
  imageSize,
  fallbackType = "default"
}: CollectionListingProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const { open: sidebarOpen } = useSidebar({ provideFallback: true })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "Owner": metadata.type === "listing",
    "Created at": metadata.type === "manage",
    "Updated at": false
  })

  const table = useReactTable({
    columns,
    data: collections,
    meta: metadata,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility }
  })

  if (collections.length === 0) {
    const handleNavigate = () => {
      const href = "/collections/manage"

      /*
      * Note: In this case, a full page reload is needed to make sure closing the popup.
      * Yeah, this is a disgusting solution, but I couldn't find a better approach.
      */
      if (pathname === "/collections/explorer") {
        router.back()
        window.location.assign(href)
        return
      }

      router.replace(href)
    }

    return (
      <>
        <NoListingData className={cn("mt-44", { "mt-4 md:mt-8": pathname === "/collections/explorer" })}
          iconProps={{ className: cn({ "sm:size-10 md:size-12": pathname === "/collections/explorer" }) }}
          messageProps={{ className: cn({ "text-base sm:text-lg md:text-xl": pathname === "/collections/explorer" }) }}
          Icon={ImageOff}
          message="No collection found."
          hideClearFilter={fallbackType === "redirect"}
        />

        {fallbackType === "redirect" && (
          <Button className="w-fit mt-4 mx-auto flex gap-x-2"
            onClick={handleNavigate}
          >
            <ImageUp className="size-4 shrink-0" />
            <span>Create your own</span>
          </Button>
        )}
      </>
    )
  }
  
  return (
    <>
      <ul className={cn("flex flex-wrap gap-8 md:hidden lg:hidden xl:hidden", {
        "md:flex 2xl:hidden": sidebarOpen,
        "xl:flex": sidebarOpen && metadata.type === "manage"
      })}>
        {collections.map((collection) => (
          <li className="flex-1 min-w-52 md:min-w-80" key={collection.id}>
            <CollectionCard
              collection={collection}
              metadata={metadata}
              imageSize={imageSize}
              key={collection.id}
              showActions
            />
          </li>
        ))}
      </ul>

      <div className={cn("hidden md:block lg:block xl:block", {
        "md:hidden 2xl:block": sidebarOpen,
        "xl:hidden": sidebarOpen && metadata.type === "manage"
      })}>
        <DataTable table={table} />
      </div>
    </>
  )
}

const CollectionListingSkeleton = () => (
  <>
    <ul className="space-y-6 block 2xl:hidden">
      {Array.from({ length: 4 }).fill('').map((_, index) => (
        <CollectionCardSkeleton key={index} />
      ))}
    </ul>

    <div className="hidden 2xl:block">
      <TableSkeleton columns={6} rows={7} />
    </div>
  </>
)

export default CollectionListing
export { CollectionListingSkeleton }
export type { CollectionListingMetadata }
