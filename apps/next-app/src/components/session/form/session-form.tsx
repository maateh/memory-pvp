"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

// types
import type { SessionFormValidation } from "@repo/schema/session-validation"
import type { ClientCardCollection } from "@repo/schema/collection"
import type { SessionFormFilter } from "@repo/schema/session"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { sessionFormValidation } from "@repo/schema/session-validation"

// utils
import { logError } from "@/lib/util/error"
import { cn } from "@/lib/util"

// icons
import { CircleFadingPlus, Loader2, SquarePlay, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { CardItem, Form } from "@/components/shared"
import { CollectionCard } from "@/components/collection/listing"
import SessionFormFields from "./session-form-fields"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"
import { useCreateSoloSessionAction } from "@/lib/safe-action/session/singleplayer"
import { useCreateRoomAction } from "@/lib/safe-action/session/multiplayer"

type SessionFormValuesCache = {
  collection?: ClientCardCollection | null
} & SessionFormValidation

type SessionFormProps = {
  search: SessionFormFilter
  collection: ClientCardCollection | null
}

const SessionForm = ({ search, collection }: SessionFormProps) => {
  const router = useRouter()

  const setCache = useCacheStore<SessionFormFilter, "set">((state) => state.set)

  const form = useForm<SessionFormValidation>({
    resolver: zodResolver(sessionFormValidation),
    values: {
      settings: {
        mode: search.mode ?? "CASUAL",
        format: search.format ?? "SOLO",
        tableSize: search.tableSize ?? "SMALL",
        collectionId: collection?.id || ""
      }
    }
  })

  const { execute: createOfflineSession } = useCreateOfflineSession()
  const {
    executeAsync: createSoloSession,
    status: createSoloSessionStatus
  } = useCreateSoloSessionAction()
  const {
    executeAsync: createWaitingRoom,
    status: createWaitingRoomStatus
  } = useCreateRoomAction()

  const openCollectionExplorer = () => {
    const { settings } = form.getValues()

    setCache(settings)
    router.push("/collections/explorer")
  }

  const handleSubmit = async (values: SessionFormValidation) => {
    const { settings, forceStart } = values

    if (settings.format === "OFFLINE") {
      createOfflineSession({ ...values, collection })
      return
    }

    try {
      if (settings.format === "SOLO") {
        await createSoloSession({ settings, forceStart })
        return
      }
  
      await createWaitingRoom({ settings })
    } catch (err) {
      logError(err)
    }
  }

  const format = form.watch("settings.format")
  const collectionId = form.watch("settings.collectionId")

  const submitText = format === "SOLO" ? "Start game"
    : format === "OFFLINE" ? "Play offline" : "Create waiting room"
  const SubmitIcon = format === "SOLO" ? SquarePlay
    : format === "OFFLINE" ? WifiOff : CircleFadingPlus

  return (
    <Form<SessionFormValidation>
      className="h-full flex flex-col gap-y-8"
      form={form}
      onSubmit={handleSubmit}
    >
      <SessionFormFields form={form} />

      <div className="my-auto flex justify-center">
        <Button className={cn("w-full max-w-xl p-0 whitespace-normal transition-transform hover:scale-105 hover:no-underline", {
          "max-w-sm": !collection
        })}
          tooltip="Select another collection"
          variant={collection ? "link" : "outline"}
          size="icon"
          type="button"
          onClick={openCollectionExplorer}
        >
          {collection ? (
            <CollectionCard className="h-fit w-full bg-background/50"
              metadata={{ type: "listing" }}
              collection={collection}
              imageSize={32}
            />
          ) : (
            <CardItem className="justify-center text-center">
              <p className="mt-1 text-base font-heading font-medium">
                No collection found for this table size.
              </p>
            </CardItem>
          )}
        </Button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-y-4">
        <Button className={cn("p-4 gap-x-2 rounded-2xl text-sm sm:p-5 sm:text-lg", {
          // TODO: different design if format is offline
          "": format === "OFFLINE"
        })}
          variant="secondary"
          size="lg"
          disabled={
            createSoloSessionStatus === "executing"
              || createWaitingRoomStatus === "executing"
              || !collectionId
              || !collection
          }
        >
          {createSoloSessionStatus === "executing" || createWaitingRoomStatus === "executing" ? (
            <Loader2 className="size-5 sm:size-6 shrink-0 animate-spin" />
          ) : (
            <SubmitIcon className="size-5 sm:size-6 shrink-0" />
          )}
          <span>{submitText}</span>
        </Button>
      </div>
    </Form>
  )
}

export default SessionForm
export type { SessionFormValuesCache }
