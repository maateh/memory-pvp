// clerk
import { SignInButton as ClerkSignInButton } from '@clerk/nextjs'

// utils
import { cn } from '@/lib/utils'

// icons
import { LogIn, LucideProps } from 'lucide-react'

// shadcn
import { Button, ButtonProps } from '@/components/ui/button'

type SignInButtonProps = {
  iconProps?: LucideProps
} & ButtonProps

const SignInButton = ({
  iconProps,
  variant = "secondary",
  size = "sm",
  className,
  ...props
}: SignInButtonProps) => {
  return (
    <ClerkSignInButton >
      <Button className={cn("h-8 gap-x-2", className)}
        variant={variant}
        size={size}
        {...props}
      >
        <LogIn {...iconProps} className={cn("size-4", iconProps?.className)} />
        <span>Sign In</span>
      </Button>
    </ClerkSignInButton>
  )
}

export default SignInButton
