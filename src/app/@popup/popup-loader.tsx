"use client"

import { useRouter } from "next/navigation"

// icons
import { Loader2 } from "lucide-react"

// shadcn
import { Content as DialogContent } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from "@/components/ui/dialog"

const PopupLoader = () => {
  const router = useRouter()

  return (
    <Dialog defaultOpen onOpenChange={router.back}>
      <DialogPortal>
        <DialogOverlay />

        <DialogContent className="w-full fixed z-50 translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Popup loader
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fallback dialog component for loading popups.
            </DialogDescription>
          </DialogHeader>

          <Loader2 className="m-auto size-14 shrink-0 text-muted-foreground animate-spin" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export { PopupLoader }
