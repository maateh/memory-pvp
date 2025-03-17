import { Suspense } from "react"

// types
import type { CollectionSort } from "@repo/schema/collection"

// schemas
import { collectionSort } from "@repo/schema/collection"

// server
import { getCollections } from "@/server/db/query/collection-query"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

// components
import { Await, PaginationHandler } from "@/components/shared"
import { CollectionUploadWidgetCard } from "@/components/collection/widget"
import { CollectionListing, CollectionListingSkeleton } from "@/components/collection/listing"

type CollectionsManagePageProps = {
  searchParams: Promise<CollectionSort>
}

const CollectionsManagePage = async ({ searchParams }: CollectionsManagePageProps) => {
  const search = await searchParams
  const searchEntries = new URLSearchParams(search as {}).entries()
  const { sort, pagination } = parseSearchParams(searchEntries, {
    sortSchema: collectionSort,
    parsePagination: true
  })

  return (
    <div className="grid grid-cols-9 gap-x-8 gap-y-16">
      <CollectionUploadWidgetCard className="w-full h-max max-w-2xl mx-auto col-span-9 xl:order-2 xl:col-span-4 2xl:col-span-3" />

      <div className="w-full col-span-9 xl:col-span-5 2xl:col-span-6">
        <Suspense fallback={<CollectionListingSkeleton />}>
          <Await promise={getCollections({ sort, pagination }, "protected")}>
            {({ data: userCollections, ...pagination }) => (
              <>
                <CollectionListing
                  collections={userCollections}
                  metadata={{ type: "manage" }}
                  imageSize={32}
                />

                {pagination.totalPage > 1 && (
                  <PaginationHandler className="py-3"
                    pathname="/collections/manage"
                    searchParams={searchParams as {}}
                    pagination={pagination}
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}

export default CollectionsManagePage
