import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

const WidgetEmptyCardLink = ({ href, scroll = false, className, children, ...props }: React.ComponentProps<typeof Link>) => {
  return (
    <Link className={cn("px-4 py-8 flex flex-col items-center justify-center rounded-2xl text-center bg-primary/25 border-2 border-input/25 border-dashed transition hover:bg-primary/35 shadow-md hover:shadow-lg dark:drop-shadow-xl hover:dark:shadow-xl", className)}
      href={href}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  )
}

export default WidgetEmptyCardLink
