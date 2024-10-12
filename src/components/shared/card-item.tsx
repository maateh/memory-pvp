// utils
import { cn } from "@/lib/utils"

const CardItem = ({ className, ...props }: React.ComponentProps<"li">) => {
  return (
    <li className={cn(
      "group w-full py-2.5 px-3 flex justify-between items-center rounded-xl transition hover:bg-transparent/5 dark:hover:bg-transparent/20",
      className
    )} {...props} />
  )
}

export default CardItem
