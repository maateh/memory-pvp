"use client"

import axios from "axios"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { z } from "zod"

// icons
import { Check } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { Form } from "@/components/form"
import { ColorPicker } from "@/components/inputs"
import { UseFormReturn } from "react-hook-form"

export type PlayerProfileFormValues = z.infer<typeof playerProfileFormSchema>

export const playerProfileFormSchema = z.object({
  playerTag: z.string(),
  color: z.string()
})

const PlayerProfileForm = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: PlayerProfileFormValues, form: UseFormReturn<PlayerProfileFormValues>) => {
    setIsLoading(true)

    try {
      await axios.post('/api/players', values)

      form.reset()
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={playerProfileFormSchema}
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
    
          <Button className="ml-3 p-1.5 hover:bg-transparent/5 dark:hover:bg-transparent/40"
            variant="ghost"
            size="icon"
          >
            <Check className="size-5 text-accent"
              strokeWidth={4}
            />
          </Button>
        </>
      )}
    </Form>
  )
}

export default PlayerProfileForm
