// actions
import { getUserCollections } from "@/server/actions/collection"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { LayoutCard } from "@/components/shared"
import { CollectionForm } from "@/components/collection/form"
import CollectionsManageTable from "./collections-manage-table"

const CollectionsManagePage = async () => {
  const userCollections = await getUserCollections()

  return (
    <div className="grid grid-cols-9 gap-x-8 gap-y-16">
      <LayoutCard className="w-full h-max max-w-xl mx-auto col-span-9 xl:order-2 xl:col-span-4 2xl:col-span-3">
        <h2 className="text-lg font-heading font-semibold tracking-wide heading-decorator subheading sm:text-xl">
          Upload collection
        </h2>

        <Separator className="mt-2.5 mb-10 bg-border/10" />

        <CollectionForm />
      </LayoutCard>

      <div className="w-full col-span-9 xl:col-span-5 2xl:col-span-6">
        <CollectionsManageTable collections={userCollections} />
      </div>
    </div>
  )
}

export default CollectionsManagePage