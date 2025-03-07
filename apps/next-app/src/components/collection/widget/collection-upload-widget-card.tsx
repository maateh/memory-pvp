// types
import type { Card } from "@/components/ui/card"

// icons
import { ImageUp } from "lucide-react"

// components
import { CollectionForm } from "@/components/collection/form"
import { WidgetCard } from "@/components/widget"

const CollectionUploadWidgetCard = ({ ...props }: React.ComponentProps<typeof Card>) => {
  return (
    <WidgetCard
      title="Upload collection"
      description="You can upload only one collection per user accounts."
      Icon={ImageUp}
      {...props}
    >
      <CollectionForm />
    </WidgetCard>
  )
}

export default CollectionUploadWidgetCard
