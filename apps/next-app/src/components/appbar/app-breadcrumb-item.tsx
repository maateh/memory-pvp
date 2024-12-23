import Link from "next/link"

// utils
import { cn } from "@/lib/util"

// icons
import { Slash } from "lucide-react"

// shadcn
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

const COLLAPSIBLE_AMOUNT = 3

type AppBreadcrumbItemProps = {
  name: string
  href: string
  routeIndex: number
  routesLength: number
}

const AppBreadcrumbItem = ({ name, href, routeIndex, routesLength }: AppBreadcrumbItemProps) => {
  const isMain = routeIndex === 0
  const isLast = routesLength === routeIndex + 1
  const isPenultimate = !isMain && !isLast && routesLength === routeIndex + 2

  const shouldCollapse = routesLength > COLLAPSIBLE_AMOUNT && !isMain && !isLast && !isPenultimate
  if (shouldCollapse) {
    if (routeIndex > 1) return null

    return (
      <>
        <BreadcrumbItem className="h-full -mx-0.5">
          <BreadcrumbEllipsis className="size-3.5 sm:size-5" />
        </BreadcrumbItem>

        <AppBreadcrumbSeparator />
      </>
    )
  }

  return (
    <>
      <BreadcrumbItem className={cn("h-full font-heading capitalize", {
        "drop-shadow-md": isMain
      })}>
        {isLast ? (
          <BreadcrumbPage className={cn("transition-all", {
            "mt-0.5 sm:mt-1 text-foreground/80 font-semibold": !isMain,
            "text-foreground/90 text-xl sm:text-2xl font-bold": isMain
          })}>
            {name}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink className={cn("transition-all underline-offset-4 decoration-0 decoration-foreground/25 hover:underline", {
            "mt-0.5 sm:mt-1 text-muted-foreground hover:text-foreground/80": !isMain,
            "text-foreground/90 text-xl sm:text-2xl font-bold hover:text-foreground": isMain
          })} asChild>
            <Link href={href}>
              {name}
            </Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>

      {!isLast && (
        <AppBreadcrumbSeparator />
      )}
    </>
  )
}

const AppBreadcrumbSeparator = ({ className, ...props }: React.ComponentProps<typeof BreadcrumbSeparator>) => (
  <BreadcrumbSeparator className={cn("-mx-1.5 sm:-mx-2", className)} {...props}>
    <Slash className="text-border/90 -rotate-[32.5deg]" />
  </BreadcrumbSeparator>
)

export default AppBreadcrumbItem
