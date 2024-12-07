// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// utils
import { parseFilterParams } from "@/lib/utils/parser"

// components
import { CollectionExplorerPopup } from "@/components/collection/popup"

type CollectionsExplorerPopupProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsExplorerPopup = ({ searchParams }: CollectionsExplorerPopupProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params) as {
    filter: CollectionFilter
    sort: CollectionSort
  }

  return (
    <CollectionExplorerPopup
      renderer="router"
      filter={filter}
      sort={sort}
    />
  )
}

export default CollectionsExplorerPopup
