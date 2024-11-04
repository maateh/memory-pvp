// types
import type {
  CollectionFilter as TCollectionFilter,
  CollectionSort as TCollectionSort
} from "@/components/collection/filter/types"

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
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  const includeUser = filter.includeUser === undefined ? true : !!filter.includeUser
  delete filter.includeUser

  const collections = await getCollections({ filter, sort, includeUser })

  return <CollectionExplorerModal collections={collections} />
}

export default CollectionExplorerModalPage
