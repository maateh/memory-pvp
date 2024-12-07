// types
import type { CollectionSort } from "@/components/collection/filter/types"

// server
import { getUserCollections } from "@/server/db/queries/collection-query"

// utils
import { parseFilterParams } from "@/lib/utils/parser"

// components
import { CollectionUploadWidgetCard } from "@/components/collection/widget"
import CollectionsManageTable from "./collections-manage-table"

type CollectionsManagePageProps = {
  searchParams: CollectionSort
}

const CollectionsManagePage = async ({ searchParams }: CollectionsManagePageProps) => {
  const params = new URLSearchParams(searchParams)
  const { sort } = parseFilterParams<typeof searchParams>(params)

  const userCollections = await getUserCollections({ sort })

  return (
    <div className="grid grid-cols-9 gap-x-8 gap-y-16">
      <CollectionUploadWidgetCard className="w-full h-max max-w-xl mx-auto col-span-9 xl:order-2 xl:col-span-4 2xl:col-span-3" />

      <div className="w-full col-span-9 xl:col-span-5 2xl:col-span-6">
        <CollectionsManageTable collections={userCollections} />
      </div>
    </div>
  )
}

export default CollectionsManagePage
