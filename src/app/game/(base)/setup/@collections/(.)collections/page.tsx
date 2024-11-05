// types
import type {
  CollectionFilter as TCollectionFilter,
  CollectionSort as TCollectionSort
} from "@/components/collection/filter/types"

// utils
import { parseFilterParams } from "@/lib/utils"

// components
import CollectionExplorerModal from "./collection-explorer-modal"

type CollectionExplorerModalPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const CollectionExplorerModalPage = ({ searchParams }: CollectionExplorerModalPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  const includeUser = filter.includeUser === undefined ? true : !!filter.includeUser
  delete filter.includeUser

  return (
    <CollectionExplorerModal
      filter={filter}
      sort={sort}
      includeUser={includeUser}
    />
  )
}

export default CollectionExplorerModalPage
