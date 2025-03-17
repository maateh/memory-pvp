// components
import { CollectionDeletePopup } from "@/components/collection/popup"

type CollectionDeletePopupPageProps = {
  params: Promise<{
    collectionId: string
  }>
}

const CollectionDeletePopupPage = async (props: CollectionDeletePopupPageProps) => {
  const params = await props.params;
  return (
    <CollectionDeletePopup
      renderer="router"
      collectionId={params.collectionId}
    />
  )
}

export default CollectionDeletePopupPage
