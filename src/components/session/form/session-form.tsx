"use client"

import { toast } from "sonner"

// types
import type { z } from "zod"
import type { DefaultValues } from "react-hook-form"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createSessionSchema } from "@/lib/validations/session-schema"

// icons
import { CircleFadingPlus, Loader2, SquarePlay, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import SessionFormFields from "./session-form-fields"

// hooks
import { useClerk } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { useStartSingleSessionMutation } from "@/lib/react-query/mutations/session"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

type SessionFormValues = z.infer<typeof createSessionSchema>

type SessionFormProps = {
  defaultValues?: DefaultValues<SessionFormValues>
  randomCollection: ClientCardCollection | null
}

const SessionForm = ({ defaultValues, randomCollection }: SessionFormProps) => {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      type: defaultValues?.type || 'CASUAL',
      mode: defaultValues?.mode || 'SINGLE',
      tableSize: defaultValues?.tableSize || 'SMALL',
      collectionId: randomCollection?.id
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
      <SessionFormFields form={form} randomCollection={randomCollection} />

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
          onClick={form.handleSubmit(() => startOfflineSession(form, randomCollection!))}
          disabled={startSession.isPending || type === 'COMPETITIVE' || mode !== 'SINGLE' || !collectionId || !randomCollection}
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
