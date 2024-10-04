"use client"

import { z } from "zod"

import type { DefaultValues } from "react-hook-form"

// clerk
import { useClerk } from "@clerk/nextjs"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// validations
import { setupGameSchema } from "@/lib/validations/game-schema"

// utils
import { cn } from "@/lib/utils"

// icons
import { CirclePlay, Loader2, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

// components
import { Form } from "@/components/shared"

// hooks
import { useStartSessionMutation } from "@/lib/react-query/mutations/game"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

export type SetupGameFormValues = z.infer<typeof setupGameSchema>

type SetupGameFormProps = {
  defaultValues?: DefaultValues<SetupGameFormValues>
}

const SetupGameForm = ({ defaultValues }: SetupGameFormProps) => {
  const { user: clerkUser } = useClerk()

  const { startSession, onSubmit } = useStartSessionMutation()
  const { startOfflineSession } = useOfflineSessionHandler()

  return (
    <Form<SetupGameFormValues>
      className="flex-1 flex flex-col justify-end gap-y-7"
      schema={setupGameSchema}
      onSubmit={onSubmit}
      defaultValues={{
        type: defaultValues?.type || 'CASUAL',
        mode: defaultValues?.mode || 'SINGLE',
        tableSize: defaultValues?.tableSize || 'SMALL'
      }}
    >
      {(form) => (
        <>
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem className="text-center space-y-1">
                <FormLabel className="relative inset-0 text-lg font-heading font-semibold small-caps sm:text-xl">
                  Select Type
                </FormLabel>
                <ButtonGroup className="max-w-sm mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(gameTypePlaceholders).map(({ key, label, Icon }) => (
                    <FormItem className="sm:last-of-type:odd:col-span-2" key={key}>
                      <FormControl>
                        <ButtonGroupItem className="w-full p-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl"
                          size="icon"
                          value={key}
                        >
                          <Icon className="size-4 sm:size-5 shrink-0" />
                          <p className="text-base sm:text-lg small-caps">
                            {label}
                          </p>
                        </ButtonGroupItem>
                      </FormControl>
                    </FormItem>
                  ))}
                </ButtonGroup>
              </FormItem>
            )}
          />

          <FormField
            name="mode"
            control={form.control}
            render={({ field }) => (
              <FormItem className="text-center space-y-1">
                <FormLabel className="relative inset-0 text-lg font-heading font-semibold small-caps sm:text-xl">
                  Select Gamemode
                </FormLabel>
                <ButtonGroup className="max-w-sm mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(gameModePlaceholders).map(({ key, label, Icon }) => (
                    <FormItem className="sm:last-of-type:odd:col-span-2" key={key}>
                      <FormControl>
                        <ButtonGroupItem className="p-2.5 w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl"
                          size="icon"
                          value={key}
                          disabled={key !== 'SINGLE'}
                        >
                          <Icon className="size-4 sm:size-5 shrink-0" />
                          <p className="text-base sm:text-lg small-caps">
                            {label}
                          </p>
                        </ButtonGroupItem>
                      </FormControl>
                    </FormItem>
                  ))}
                </ButtonGroup>
              </FormItem>
            )}
          />

          <Separator className="max-w-16 mx-auto -my-1 bg-border/40" />

          <FormField
            name="tableSize"
            control={form.control}
            render={({ field }) => (
              <FormItem className="text-center space-y-0.5">
                <FormLabel className="relative inset-0 text-base font-heading font-semibold small-caps sm:text-lg">
                  Table Size
                </FormLabel>
                <ButtonGroup className="max-w-sm mx-auto grid gap-1.5 grid-cols-1 sm:grid-cols-2"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(tableSizePlaceholders).map(({ key, label, size, Icon }) => (
                    <FormItem className="sm:last-of-type:odd:col-span-2" key={key}>
                      <FormControl>
                        <ButtonGroupItem className="p-2 w-4/5 sm:w-full sm:max-w-44 mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl"
                          size="icon"
                          value={key}
                        >
                          <Icon className="size-4 sm:size-[1.125rem] shrink-0" />

                          <p className="text-base small-caps">
                            {label}<span className="text-xs text-muted-foreground"> / {size}</span>
                          </p>
                        </ButtonGroupItem>
                      </FormControl>
                    </FormItem>
                  ))}
                </ButtonGroup>
              </FormItem>
            )}
          />

          <div className="mt-auto flex flex-col items-center gap-y-4">
            <Button className="py-6 px-4 gap-x-2 text-base sm:text-lg"
              variant="secondary"
              disabled={!clerkUser || startSession.isPending}
            >
              {startSession.isPending ? (
                <Loader2 className="size-5 sm:size-6 shrink-0 animate-spin" />
              ) : (
                <CirclePlay className="size-5 sm:size-6 shrink-0" />
              )}
              Start new game
            </Button>

            <Button className={cn("gap-x-2 bg-foreground/30 hover:bg-foreground/35 text-foreground/90 text-sm sm:text-base", {
              "opacity-40 pointer-events-none": startSession.isPending
            })}
              size="sm"
              type="button"
              onClick={form.handleSubmit(() => startOfflineSession(form))}
              disabled={startSession.isPending}
            >
              <WifiOff className="size-4 sm:size-5 shrink-0" />
              Start offline
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}

export default SetupGameForm
