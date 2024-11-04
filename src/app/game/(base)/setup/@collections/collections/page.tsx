// types
import type { CollectionFilter as TCollectionFilter } from "@/components/collection/filter/collection-filter"
import type { CollectionSort as TCollectionSort } from "@/components/collection/filter/collection-sort"

// server
import { getCollections } from "@/server/actions/collection"

// utils
import { parseFilterParams } from "@/lib/utils"

// components
import CollectionsExplorerModal from "./collections-explorer-modal"

type SelectCollectionModalPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const SelectCollectionModalPage = async ({ searchParams }: SelectCollectionModalPageProps) => {
  const params = new URLSearchParams(searchParams)

  const collections = await getCollections({
    ...parseFilterParams<typeof searchParams>(params),
    includeUser: true
  })

  return (
    <CollectionsExplorerModal collections={collections} />
  )
}

export default SelectCollectionModalPage
