// types
import type { CollectionFilter, CollectionSort } from "@repo/schema/collection"
import type { SearchPattern } from "@/lib/types/search"

// schemas
import { collectionFilter, collectionSort } from "@repo/schema/collection"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

// components
import { CollectionExplorerPopup } from "@/components/collection/popup"

type CollectionsExplorerPopupProps = {
  searchParams: Promise<CollectionFilter & CollectionSort>
}

const CollectionsExplorerPopup = async ({ searchParams }: CollectionsExplorerPopupProps) => {
  const search = await searchParams as SearchPattern
  const searchEntries = new URLSearchParams(search).entries()
  const { filter, sort, pagination } = parseSearchParams(searchEntries, {
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
      search={search}
    />
  )
}

export default CollectionsExplorerPopup
