// types
import type { CollectionFilter, CollectionSort } from "@repo/schema/collection"

// schemas
import { collectionFilter, collectionSort } from "@repo/schema/collection"

// utils
import { parseSearchParams } from "@/lib/util/parser"

// components
import { CollectionExplorerPopup } from "@/components/collection/popup"

type CollectionsExplorerPopupProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsExplorerPopup = ({ searchParams }: CollectionsExplorerPopupProps) => {
  const { filter, sort, pagination } = parseSearchParams(searchParams, {
    filterSchema: collectionFilter,
    sortSchema: collectionSort,
    parsePagination: true
  })

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
