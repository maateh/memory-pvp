"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"

// types
import type { DefaultValues } from "react-hook-form"
import type { SessionFormValidation } from "@repo/schema/session-validation"
import type { ClientCardCollection } from "@/lib/schema/collection-schema"

// clerk
import { useClerk } from "@clerk/nextjs"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { sessionFormValidation } from "@repo/schema/session-validation"

// icons
import { CircleFadingPlus, Loader2, SquarePlay, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { CardItem, Form } from "@/components/shared"
import { CollectionCard } from "@/components/collection/listing"
import SessionFormFields from "./session-form-fields"

// hooks
import { useCreateSingleSessionAction } from "@/lib/safe-action/session"
import { useCreateRoomAction } from "@/lib/safe-action/room"
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"

type SessionFormValuesCache = {
  collection?: ClientCardCollection | null
} & SessionFormValidation

type SessionFormProps = {
  defaultValues?: DefaultValues<SessionFormValidation>
  collection: ClientCardCollection | null
}

const SessionForm = ({ defaultValues, collection }: SessionFormProps) => {
  const { user: clerkUser } = useClerk()

  const form = useForm<SessionFormValidation>({
    resolver: zodResolver(sessionFormValidation),
    defaultValues: {
      settings: {
        type: defaultValues?.settings?.type ?? "CASUAL",
        mode: defaultValues?.settings?.mode ?? "SINGLE",
        tableSize: defaultValues?.settings?.tableSize ?? "SMALL",
        collectionId: collection?.id,
      }
    }
  })

  const {
    execute: createSingleSession,
    status: createSingleSessionStatus
  } = useCreateSingleSessionAction()
  const {
    execute: createWaitingRoom,
    status: createRoomActionStatus
  } = useCreateRoomAction()
  const { execute: createOfflineSession } = useCreateOfflineSession()

  const handleSubmit = (values: SessionFormValidation) => {
    const { settings, forceStart } = values

    if (settings.mode === "SINGLE") {
      createSingleSession({ settings, forceStart })
      return
    }

    createWaitingRoom({ settings })
  }

  const type = form.watch("settings.type")
  const mode = form.watch("settings.mode")
  const collectionId = form.watch("settings.collectionId")
  
  const SubmitIcon = mode === "SINGLE" ? SquarePlay : CircleFadingPlus

  return (
    <Form<SessionFormValidation>
      className="h-full flex flex-col gap-y-8"
      form={form}
      onSubmit={handleSubmit}
    >
      <SessionFormFields form={form} />

      <div className="my-auto flex justify-center">
        <Button className="w-full max-w-xl p-0 whitespace-normal transition-transform hover:scale-105 hover:no-underline"
          tooltip={collection ? "Click to select another collection" : "Manage collections"}
          variant={collection ? "link" : "destructive"}
          size="icon"
          type="button"
          asChild
        >
          <Link href={collection ? "/collections/explorer" : "/collections/manage"} scroll={false}>
            {collection ? (
              <CollectionCard className="h-fit w-full bg-background/50"
                metadata={{ type: "listing" }}
                collection={collection}
                imageSize={32}
              />
            ) : (
              <CardItem className="justify-center text-center bg-destructive/85 text-destructive-foreground">
                <p className="mt-1 text-base sm:text-lg font-heading font-semibold">
                  Create your first ever card collection!
                </p>
              </CardItem>
            )}
          </Link>
        </Button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-y-4">
        <Button className="p-4 gap-x-2 rounded-2xl text-sm sm:p-5 sm:text-lg"
          variant="secondary"
          size="lg"
          disabled={
            !clerkUser
              || createSingleSessionStatus === 'executing'
              || createRoomActionStatus === 'executing'
              || !collectionId
              || !collection
          }
        >
          {createSingleSessionStatus === 'executing' || createRoomActionStatus === 'executing' ? (
            <Loader2 className="size-5 sm:size-6 shrink-0 animate-spin" />
          ) : (
            <SubmitIcon className="size-5 sm:size-6 shrink-0" />
          )}

          <span>
            {mode === 'SINGLE' ? 'Start new game' : 'Create waiting room...'}
          </span>
        </Button>

        <Button className="gap-x-2 rounded-2xl bg-foreground/30 hover:bg-foreground/35 text-foreground/90 text-sm font-normal sm:text-base"
          size="sm"
          type="button"
          onClick={form.handleSubmit((values) => createOfflineSession({ ...values, collection }))}
          disabled={
            createSingleSessionStatus === 'executing'
              || createRoomActionStatus === 'executing'
              || type === 'COMPETITIVE'
              || mode !== 'SINGLE'
              || !collectionId
              || !collection
          }
        >
          <WifiOff className="size-4 sm:size-5 shrink-0" strokeWidth={1.5} />
          <span>Start offline</span>
        </Button>
      </div>
    </Form>
  )
}

export default SessionForm
export type { SessionFormValuesCache }
