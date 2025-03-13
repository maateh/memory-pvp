// types
import type { CollectionFilter, CollectionSort } from "@repo/schema/collection"

// utils
import { parseFilterParams } from "@/lib/util/parser"

// components
import { CollectionExplorerPopup } from "@/components/collection/popup"

type CollectionsExplorerPopupProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsExplorerPopup = ({ searchParams }: CollectionsExplorerPopupProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort, pagination } = parseFilterParams<typeof searchParams>(params)

  return (
    <CollectionExplorerPopup
      renderer="router"
      filter={filter}
      sort={sort}
      pagination={pagination}
      searchParams={searchParams as {}}
    />
  )
}

export default CollectionsExplorerPopup
