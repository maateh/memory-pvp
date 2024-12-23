// components
import { CollectionEditPopup } from "@/components/collection/popup"

type CollectionEditPopupPageProps = {
  params: {
    collectionId: string
  }
}

const CollectionEditPopupPage = ({ params }: CollectionEditPopupPageProps) => {
  return (
    <CollectionEditPopup
      renderer="router"
      collectionId={params.collectionId}
    />
  )
}

export default CollectionEditPopupPage
