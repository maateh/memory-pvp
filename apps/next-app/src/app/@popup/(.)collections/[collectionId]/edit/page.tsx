// components
import { CollectionEditPopup } from "@/components/collection/popup"

type CollectionEditPopupPageProps = {
  params: Promise<{
    collectionId: string
  }>
}

const CollectionEditPopupPage = async (props: CollectionEditPopupPageProps) => {
  const params = await props.params;
  return (
    <CollectionEditPopup
      renderer="router"
      collectionId={params.collectionId}
    />
  )
}

export default CollectionEditPopupPage
