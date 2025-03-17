// components
import { CollectionDeletePopup } from "@/components/collection/popup"

type CollectionDeletePopupPageProps = {
  params: Promise<{
    collectionId: string
  }>
}

const CollectionDeletePopupPage = async ({ params }: CollectionDeletePopupPageProps) => {
  const { collectionId } = await params

  return (
    <CollectionDeletePopup
      renderer="router"
      collectionId={collectionId}
    />
  )
}

export default CollectionDeletePopupPage
