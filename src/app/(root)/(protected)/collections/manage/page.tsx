// actions
import { getUserCollections } from "@/server/actions/collection"

// components
import { LayoutCard } from "@/components/shared"
import { CollectionForm } from "@/components/collection/form"
import CollectionsManageTable from "./collections-manage-table"

const CollectionsManagePage = async () => {
  const userCollections = await getUserCollections()

  return (
    <div className="grid grid-cols-9 gap-x-8 gap-y-16">
      <LayoutCard className="w-full h-max max-w-xl mx-auto col-span-9 xl:col-span-4 2xl:col-span-3">
        <h2 className="mb-10 text-lg font-heading font-semibold small-caps heading-decorator subheading">
          Upload collection cards
        </h2>

        <CollectionForm />
      </LayoutCard>

      <div className="w-full col-span-9 xl:col-span-5 2xl:col-span-6">
        <CollectionsManageTable collections={userCollections} />
      </div>
    </div>
  )
}

export default CollectionsManagePage
