// utils
import { cn } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

const CardItem = ({ className, ...props }: React.ComponentProps<"li">) => {
  return (
    <>
      <li className={cn(
        "group w-full py-2.5 px-3 flex justify-between items-center rounded-xl transition hover:bg-transparent/5 dark:hover:bg-transparent/20",
        className
      )} {...props} />

      <Separator className="last:hidden w-5/6 mx-auto bg-border/10" />
    </>
  )
}

export default CardItem
