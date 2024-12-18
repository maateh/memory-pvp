"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"

// types
import type { z } from "zod"
import type { DefaultValues } from "react-hook-form"

// clerk
import { useClerk } from "@clerk/nextjs"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createSessionSchema } from "@/lib/schema/validation/session-validation"

// icons
import { CircleFadingPlus, Loader2, SquarePlay, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { CardItem, Form } from "@/components/shared"
import { CollectionCard } from "@/components/collection/listing"
import SessionFormFields from "./session-form-fields"

// hooks
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"
import { useCreateSessionAction } from "@/lib/safe-action/session"

type SessionFormValues = z.infer<typeof createSessionSchema>

type SessionFormValuesCache = {
  sessionValues: SessionFormValues
  collection: ClientCardCollection | null
}

type SessionFormProps = {
  defaultValues?: DefaultValues<SessionFormValues>
  collection: ClientCardCollection | null
}

const SessionForm = ({ defaultValues, collection }: SessionFormProps) => {
  const { user: clerkUser } = useClerk()

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      type: defaultValues?.type || 'CASUAL',
      mode: defaultValues?.mode || 'SINGLE',
      tableSize: defaultValues?.tableSize || 'SMALL',
      collectionId: collection?.id
    }
  })

  const {
    execute: executeCreateSession,
    status: createSessionStatus
  } = useCreateSessionAction()
  const { execute: createOfflineSession } = useCreateOfflineSession()

  const type = form.watch('type')
  const mode = form.watch('mode')
  const collectionId = form.watch('collectionId')
  
  const SubmitIcon = mode === 'SINGLE' ? SquarePlay : CircleFadingPlus

  return (
    <Form<SessionFormValues>
      className="h-full flex flex-col gap-y-8"
      form={form}
      onSubmit={executeCreateSession}
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
              || createSessionStatus === 'executing'
              || !collectionId
              || !collection
          }
        >
          {createSessionStatus === 'executing' ? (
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
          onClick={form.handleSubmit((sessionValues) => createOfflineSession({ sessionValues, collection }))}
          disabled={
            createSessionStatus === 'executing'
              || type === 'COMPETITIVE'
              || mode !== 'SINGLE'
              || !collectionId
              || !collection
          }
        >
          <WifiOff className="size-4 sm:size-5 shrink-0"
            strokeWidth={1.5}
          />

          <span>Start offline</span>
        </Button>
      </div>
    </Form>
  )
}

export default SessionForm
export type { SessionFormValues, SessionFormValuesCache }
