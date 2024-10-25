// constants
import { collectionUploadWidgetInfo } from "@/components/widgets/constants" 

// components
import { CollectionForm } from "@/components/collection/form"
import { WidgetModal, WidgetSubheader } from "@/components/widgets"

const CollectionsUploadWidgetModal = () => {
  return (
    <WidgetModal {...collectionUploadWidgetInfo}>
      <WidgetSubheader>
        Upload collection cards
      </WidgetSubheader>

      <CollectionForm />
    </WidgetModal>
  )
}

export default CollectionsUploadWidgetModal
