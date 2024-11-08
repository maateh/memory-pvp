// types
import type { DialogProps } from "@radix-ui/react-dialog"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionEditForm } from "@/components/collection/form"

type CollectionEditModalProps = {
  collection: ClientCardCollection
} & DialogProps

const CollectionEditModal = ({ collection, ...props }: CollectionEditModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="pb-6 border-border/40">
        <DialogHeader>
          <DialogTitle className="heading-decorator">
            Update collection
          </DialogTitle>

          <DialogDescription>
            Update the name or the description of this collection.
          </DialogDescription>
        </DialogHeader>

        <Separator className="w-5/6 mx-auto bg-border/15" />

        <div className="flex items-center gap-x-2">
          <Separator className="h-4 w-1 mt-1 rounded-full"
            orientation="vertical"
          />

          <p className="mt-1 tracking-wide text-base sm:text-xl font-medium font-heading">
            {collection.name}
          </p>
        </div>

        <Separator className="w-1/5 mx-auto bg-border/10" />

        <CollectionEditForm
          collection={collection}
          resetForm={() => props.onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CollectionEditModal
