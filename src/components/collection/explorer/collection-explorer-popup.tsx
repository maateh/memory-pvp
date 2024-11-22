"use client"

// types
import type { DialogTrigger } from "@/components/ui/dialog"
import type { DrawerTrigger } from "@/components/ui/drawer"

// components
import { CollectionExplorerDrawer, CollectionExplorerModal } from "@/components/collection/explorer"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type CollectionExplorerPopupProps = {
  collections: ClientCardCollection[]
  renderer: PopupRenderer
  drawerProps?: React.ComponentProps<typeof DrawerTrigger>
  modalProps?: React.ComponentProps<typeof DialogTrigger>
}

const CollectionExplorerPopup = ({ collections, renderer, drawerProps, modalProps }: CollectionExplorerPopupProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <CollectionExplorerDrawer
        renderer={renderer}
        collections={collections}
        {...drawerProps}
      />
    )
  }

  return (
    <CollectionExplorerModal
      renderer={renderer}
      collections={collections}
      {...modalProps}
    />
  )
}

export default CollectionExplorerPopup
