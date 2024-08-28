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

export type PlayerProfileFormValues = z.infer<typeof playerProfileFormSchema>

const playerProfileFormSchema = z.object({
  playerName: z.string(),
  color: z.string()
})

const PlayerProfileForm = () => {
  const onSubmit = async (values: PlayerProfileFormValues) => {
    // TODO: create player profile
    console.log({ values })
  }

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={playerProfileFormSchema}
      onSubmit={onSubmit}
      defaultValues={{
        playerName: '',
        color: ''
      }}
    >
      {({ control }) => (
        <>
          <FormField
            control={control}
            name="playerName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Player Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
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

          <Button className="ml-3 p-1.5 hover:bg-transparent/5 dark:hover:bg-transparent/5"
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
