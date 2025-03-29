import * as React from "react"

import { cn } from "@/lib/util"

const Card = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => (<div
  ref={ref}
  className={cn(
    "bg-card text-card-foreground border-0 rounded-2xl shadow-md drop-shadow-xs hover:shadow-lg dark:shadow-lg dark:drop-shadow-md dark:hover:shadow-xl transition-shadow duration-300",
    className
  )}
  {...props}
/>)
Card.displayName = "Card"

const CardHeader = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => (<div
  ref={ref}
  className={cn("flex flex-col gap-y-0.5 px-6 py-4", className)}
  {...props}
/>)
CardHeader.displayName = "CardHeader"

const CardTitle = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement> & {
    ref: React.RefObject<HTMLParagraphElement>;
  }
) => (<h3
  ref={ref}
  className={cn(
    "text-2xl font-semibold leading-none tracking-tight",
    className
  )}
  {...props}
/>)
CardTitle.displayName = "CardTitle"

const CardDescription = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement> & {
    ref: React.RefObject<HTMLParagraphElement>;
  }
) => (<p
  ref={ref}
  className={cn("text-sm text-muted-foreground", className)}
  {...props}
/>)
CardDescription.displayName = "CardDescription"

const CardContent = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => (<div ref={ref} className={cn("p-6 pt-2", className)} {...props} />)
CardContent.displayName = "CardContent"

const CardFooter = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => (<div
  ref={ref}
  className={cn("flex items-center p-6 pt-0", className)}
  {...props}
/>)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
