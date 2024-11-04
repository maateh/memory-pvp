"use client"

import Link from "next/link"
import { toast } from "sonner"

// types
import type { z } from "zod"
import type { DefaultValues } from "react-hook-form"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createSessionSchema } from "@/lib/validations/session-schema"

// utils
import { cn } from "@/lib/utils"

// icons
import { CircleFadingPlus, Images, Loader2, SquarePlay, WifiOff } from "lucide-react"

// shadcn
import { Button, buttonVariants } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import { CollectionCard } from "@/components/collection"
import SessionFormFields from "./session-form-fields"

// hooks
import { useClerk } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { useStartSingleSessionMutation } from "@/lib/react-query/mutations/session"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

type SessionFormValues = z.infer<typeof createSessionSchema>

type SessionFormProps = {
  defaultValues?: DefaultValues<SessionFormValues>
  collection: ClientCardCollection | null
}

const SessionForm = ({ defaultValues, collection }: SessionFormProps) => {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      type: defaultValues?.type || 'CASUAL',
      mode: defaultValues?.mode || 'SINGLE',
      tableSize: defaultValues?.tableSize || 'SMALL',
      collectionId: collection?.id
    }
  })

  const { user: clerkUser } = useClerk()

  const { startSession, handleStartSingleSession } = useStartSingleSessionMutation({ form })
  const { startOfflineSession } = useOfflineSessionHandler()

  const onSubmit = (values: SessionFormValues) => {
    if (values.mode === 'SINGLE') {
      handleStartSingleSession(values)
      return
    }

    // TODO: implement multiplayer
    toast.warning("Work in progress", {
      description: "Sorry, but multiplayer game sessions are not implemented yet."
    })
  }

  const type = form.watch('type')
  const mode = form.watch('mode')
  const collectionId = form.watch('collectionId')
  const SubmitIcon = mode === 'SINGLE' ? SquarePlay : CircleFadingPlus

  return (
    <Form<SessionFormValues>
      className="h-full flex flex-col gap-y-8"
      form={form}
      onSubmit={onSubmit}
    >
      <SessionFormFields form={form} />

      <div className="w-full max-w-2xl m-auto lg:w-2/5">
        <div className="flex flex-wrap-reverse justify-between items-center gap-x-6 gap-y-2">
          <h3 className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-semibold tracking-wide heading-decorator subheading sm:text-2xl">
            Card collection
          </h3>

          <Link className={cn(buttonVariants({
            className: "mb-2.5 ml-auto p-2.5 gap-x-2 text-muted-foreground border border-border/20 rounded-2xl expandable expandable-left",
            variant: "ghost",
            size: "icon"
          }))}
            href="/game/setup/collections"
            scroll={false}
          >
            <div>
              <span className="font-normal dark:font-light">
                Browse collections...
              </span>
            </div>
            <Images className="size-4" strokeWidth={2.5} />
          </Link>
        </div>
        
        {collection && (
          <CollectionCard className="h-fit w-full bg-background/50"
            collection={collection}
            imageSize={26}
            withoutGameLink
          />
        )}
      </div>
      

      <div className="mt-auto flex flex-col items-center gap-y-4">
        <Button className="p-4 gap-x-2 rounded-2xl text-sm sm:p-5 sm:text-lg"
          variant="secondary"
          size="lg"
          disabled={!clerkUser || startSession.isPending}
        >
          {startSession.isPending ? (
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
          onClick={form.handleSubmit(() => startOfflineSession(form, collection!))}
          disabled={startSession.isPending || type === 'COMPETITIVE' || mode !== 'SINGLE' || !collectionId || !collection}
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
export type { SessionFormValues }
