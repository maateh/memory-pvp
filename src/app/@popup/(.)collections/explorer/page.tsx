import { Suspense } from "react"

// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/db/collection"

// utils
import { parseFilterParams } from "@/lib/utils"

// components
import { CollectionExplorerPopup } from "@/components/collection/explorer"
import { Await } from "@/components/shared"
import { PopupLoader } from "@/app/@popup/popup-loader"

type CollectionsExplorerPopupProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsExplorerPopup = ({ searchParams }: CollectionsExplorerPopupProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params) as {
    filter: CollectionFilter
    sort: CollectionSort
  }

  const includeUser = filter.includeUser === undefined ? true : !!filter.includeUser
  delete filter.includeUser

  return (
    <Suspense fallback={<PopupLoader />}>
      <Await promise={getCollections({ filter, sort, includeUser })}>
        {(collections) => (
          <CollectionExplorerPopup
            renderer="router"
            collections={collections}
          />
        )}
      </Await>
    </Suspense>
  )
}

export default CollectionsExplorerPopup
