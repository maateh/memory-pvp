// components
import { CollectionDeletePopup } from "@/components/collection/popup"

type CollectionDeletePopupPageProps = {
  params: {
    collectionId: string
  }
}

const CollectionDeletePopupPage = ({ params }: CollectionDeletePopupPageProps) => {
  return (
    <CollectionDeletePopup
      renderer="router"
      collectionId={params.collectionId}
    />
  )
}

export default CollectionDeletePopupPage
