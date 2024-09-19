"use client"

import { z } from "zod"

import type { DefaultValues, UseFormReturn } from "react-hook-form"

// clerk
import { useClerk } from "@clerk/nextjs"

// constants
import { gameModes, gameTypes, tableSizes } from "@/constants/game"

// validations
import { startGameSchema } from "@/lib/validations"

// utils
import { cn } from "@/lib/utils"

// icons
import { CirclePlay, Loader2, WifiOff } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

// components
import { Form } from "@/components/form"

// hooks
import { useStartGameMutation } from "@/lib/react-query/mutations/game"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

export type StartGameFormValues = z.infer<typeof startGameSchema>

export type StartGameSessionParams = {
  values: StartGameFormValues
  form: UseFormReturn<StartGameFormValues>
}

type StartGameFormProps = {
  defaultValues?: DefaultValues<StartGameFormValues>
}

const StartGameForm = ({ defaultValues }: StartGameFormProps) => {
  const { user: clerkUser } = useClerk()

  const { startGame, onSubmit } = useStartGameMutation()
  const { startOfflineSession } = useOfflineSessionHandler()

  return (
    <Form<StartGameFormValues>
      className="flex-1 flex flex-col justify-end gap-y-8"
      schema={startGameSchema}
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
                  {gameTypes.map(({ key, label, Icon }) => (
                    <FormItem className="sm:last-of-type:odd:col-span-2" key={key}>
                      <FormControl>
                        <ButtonGroupItem className="w-full p-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl"
                          size="icon"
                          value={key}
                          disabled={key === 'COMPETITIVE'}
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
                  {gameModes.map(({ key, label, Icon }) => (
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

          <FormField
            name="tableSize"
            control={form.control}
            render={({ field }) => (
              <FormItem className="text-center space-y-1">
                <FormLabel className="relative inset-0 text-lg font-heading font-semibold small-caps sm:text-xl">
                  Table Size
                </FormLabel>
                <ButtonGroup className="max-w-sm mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {tableSizes.map(({ key, label, Icon }) => (
                    <FormItem className="sm:last-of-type:odd:col-span-2" key={key}>
                      <FormControl>
                        <ButtonGroupItem className="p-2.5 w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 border-background/85 bg-background/25 rounded-2xl"
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

          <div className="mt-auto flex flex-col items-center gap-y-4">
            <Button className="py-6 px-4 gap-x-2 text-base sm:text-lg"
              variant="secondary"
              disabled={!clerkUser || startGame.isPending}
            >
              {startGame.isPending ? (
                <Loader2 className="size-5 sm:size-6 shrink-0 animate-spin" />
              ) : (
                <CirclePlay className="size-5 sm:size-6 shrink-0" />
              )}
              Start new game
            </Button>

            <Button className={cn("gap-x-2 bg-foreground/30 hover:bg-foreground/35 text-foreground/90 text-sm sm:text-base", {
              "opacity-40 pointer-events-none": startGame.isPending
            })}
              size="sm"
              type="button"
              onClick={() => form.handleSubmit((data) => startOfflineSession(data, form))()}
              disabled={startGame.isPending}
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

export default StartGameForm
