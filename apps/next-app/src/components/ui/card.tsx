import * as React from "react"

import { cn } from "@/lib/util"

const Card = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("bg-card text-card-foreground border-0 rounded-2xl shadow-md drop-shadow-xs hover:shadow-lg dark:shadow-lg dark:drop-shadow-md dark:hover:shadow-xl transition-shadow duration-300", className)}
    data-slot="card"
    {...props}
  />
)

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-y-0.5 px-6 py-4", className)}
    data-slot="card-header"
    {...props}
  />
)

const CardTitle = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    data-slot="card-title"
    {...props}
  />
)

const CardDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p className={cn("text-sm text-muted-foreground", className)}
    data-slot="card-description"
    {...props}
  />
)

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("p-6 pt-2", className)}
    data-slot="card-content"
    {...props}
  />
)

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center p-6 pt-0", className)}
    data-slot="card-footer"
    {...props}
  />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
