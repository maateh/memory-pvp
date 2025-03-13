import { Suspense } from "react"

// types
import type { CollectionSort } from "@repo/schema/collection"

// schemas
import { collectionSort } from "@repo/schema/collection"

// server
import { getUserCollections } from "@/server/db/query/collection-query"

// utils
import { parseSearchParams } from "@/lib/util/parser"

// components
import { Await, PaginationHandler } from "@/components/shared"
import { CollectionUploadWidgetCard } from "@/components/collection/widget"
import { CollectionListing } from "@/components/collection/listing"

type CollectionsManagePageProps = {
  searchParams: CollectionSort
}

const CollectionsManagePage = ({ searchParams }: CollectionsManagePageProps) => {
  const { sort, pagination } = parseSearchParams(searchParams, {
    sortSchema: collectionSort,
    parsePagination: true
  })

  return (
    <div className="grid grid-cols-9 gap-x-8 gap-y-16">
      <CollectionUploadWidgetCard className="w-full h-max max-w-2xl mx-auto col-span-9 xl:order-2 xl:col-span-4 2xl:col-span-3" />

      <div className="w-full col-span-9 xl:col-span-5 2xl:col-span-6">
        <Suspense>
          <Await promise={getUserCollections({ sort, pagination })}>
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
