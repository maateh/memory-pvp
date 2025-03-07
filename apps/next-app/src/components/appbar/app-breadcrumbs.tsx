"use client"

import { usePathname } from "next/navigation"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb"

// components
import AppBreadcrumbItem from "./app-breadcrumb-item"

const AppBreadcrumbs = ({ className, ...props }: React.ComponentProps<typeof Breadcrumb>) => {
  const pathname = usePathname()
  const routes = pathname.split('/').slice(1, pathname.length)

  return (
    <Breadcrumb className={cn("flex items-center ml-1 pt-1.5 px-4 animate-in slide-in-from-left duration-300 lg:h-full lg:px-0", className)} {...props}>
      <BreadcrumbList className="justify-center gap-y-0.5 overflow-hidden lg:h-full lg:flex-nowrap lg:gap-y-6">
        {routes.map((route, index) => (
          <AppBreadcrumbItem
            name={route}
            href={`/${routes.slice(0, index + 1).join('/')}`}
            routeIndex={index}
            routesLength={routes.length}
            key={route}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppBreadcrumbs
