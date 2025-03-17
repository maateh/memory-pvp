// components
import { CollectionEditPopup } from "@/components/collection/popup"

type CollectionEditPopupPageProps = {
  params: Promise<{
    collectionId: string
  }>
}

const CollectionEditPopupPage = async ({ params }: CollectionEditPopupPageProps) => {
  const { collectionId } = await params

  return (
    <CollectionEditPopup
      renderer="router"
      collectionId={collectionId}
    />
  )
}

export default CollectionEditPopupPage
