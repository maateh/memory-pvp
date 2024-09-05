"use client"

import { z, ZodError } from "zod"

import { useRouter } from "next/navigation"

import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// lib
import { playerProfileCreateSchema } from "@/lib/validations"

// icons
import { Check, Loader2 } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { Form } from "@/components/form"
import { ColorPicker } from "@/components/inputs"

type PlayerProfileFormValues = z.infer<typeof playerProfileCreateSchema>

const PlayerProfileForm = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const createPlayer = api.playerProfile.create.useMutation({
    onSuccess: async () => {
      toast.success('Player created!', {
        description: `You've created a new player profile: asd`
      })

      router.refresh()
      await utils.playerProfile.invalidate()
    },
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('Player tag is already in use.', {
          description: 'Please try another player tag.'
        })
        return
      }

      if (err instanceof ZodError) {
        toast.error('Validation error', {
          description: 'Please fill in fields correctly.'
        })
        return
      }

      toast.error('Something went wrong.', {
        description: 'Failed to create player profile. Please try again later.'
      })
    }
  })

  const onSubmit = async (values: PlayerProfileFormValues, form: UseFormReturn<PlayerProfileFormValues>) => {
    try {
      await createPlayer.mutateAsync(values)

      form.reset()
    } catch (err) {
      throw new TRPCClientError('Failed to create player profile', { cause: err as Error })
    }
  }

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={playerProfileCreateSchema}
      onSubmit={onSubmit}
      defaultValues={{
        playerTag: '',
        color: '#92aa92'
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="playerTag"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Player Tag
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    
          <ButtonTooltip className="ml-3 p-1.5 hover:bg-transparent/5 dark:hover:bg-transparent/40"
            tooltip="Add player profile"
            variant="ghost"
            size="icon"
            disabled={createPlayer.isPending}
          >
            {createPlayer.isPending ? (
              <Loader2 className="size-5 text-accent animate-spin"
                strokeWidth={4}
              />
            ) : (
              <Check className="size-5 text-accent"
                strokeWidth={4}
              />
            )}
          </ButtonTooltip>
        </>
      )}
    </Form>
  )
}

export default PlayerProfileForm
