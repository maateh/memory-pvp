// types
import type { CollectionFilter as TCollectionFilter } from "@/components/collection/filter/collection-filter"
import type { CollectionSort as TCollectionSort } from "@/components/collection/filter/collection-sort"

// server
import { getCollections } from "@/server/actions/collection"

// utils
import { parseFilterParams } from "@/lib/utils"

// components
import CollectionExplorerModal from "./collection-explorer-modal"

type CollectionExplorerModalPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const CollectionExplorerModalPage = async ({ searchParams }: CollectionExplorerModalPageProps) => {
  const params = new URLSearchParams(searchParams)

  const collections = await getCollections({
    ...parseFilterParams<typeof searchParams>(params),
    includeUser: true
  })

  return <CollectionExplorerModal collections={collections} />
}

export default CollectionExplorerModalPage
