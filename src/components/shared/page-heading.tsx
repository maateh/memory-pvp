// utils
import { cn } from "@/lib/utils"

type PageHeadingProps = {
  title: string
  className?: string
} & React.ComponentProps<"div">

const PageHeading = ({ title, className, ...props }: PageHeadingProps) => {
  return (
    <div className={cn("bg-primary/50 shadow-lg w-fit rounded-r-3xl pt-4 sm:pt-5 pb-1 sm:pb-2 pl-8 sm:pl-12 pr-12 sm:pr-16 -mx-2 -mt-2.5 sm:-mx-6", className)}
      {...props}
    >
      <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-wide drop-shadow-md heading-decorator">
        {title}
      </h1>
    </div>
  )
}

export default PageHeading
