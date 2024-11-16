// types
import type { DialogProps } from "@radix-ui/react-dialog"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type WarningModalProps = {
  title: React.ReactNode
  description: React.ReactNode
} & DialogProps

const WarningModal = ({ title, description, children, ...props }: WarningModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-normal underline decoration-destructive underline-offset-8">
            {title}
          </DialogTitle>

          <DialogDescription className="w-5/6 mx-auto">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Separator className="w-3/5 mx-auto mt-1 mb-2.5 bg-border/25" />

        {children}
      </DialogContent>
    </Dialog>
  )
}

const WarningModalFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <DialogFooter className={cn("mt-2.5 mx-8 flex flex-wrap flex-row items-center justify-around gap-x-8 gap-y-2.5 sm:justify-around", className)}
      {...props}
    >
      {children}
    </DialogFooter>
  )
}

const WarningActionButton = ({
  className,
  variant = "destructive",
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button className={cn("flex-1 max-w-64", className)}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  )
}

const WarningCancelButton = ({
  className,
  variant = "ghost",
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button className={cn("flex-1 max-w-64 border", className)}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  )
}

export default WarningModal
export { WarningModalFooter, WarningActionButton, WarningCancelButton }
