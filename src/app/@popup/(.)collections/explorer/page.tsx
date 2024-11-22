// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// utils
import { parseFilterParams } from "@/lib/utils"

// components
import { CollectionExplorerPopup } from "@/components/collection/explorer"

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
    <CollectionExplorerPopup
      filter={filter}
      sort={sort}
      includeUser={includeUser}
    />
  )
}

export default CollectionsExplorerPopup
