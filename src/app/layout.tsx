import type { Metadata } from "next"
import { Josefin_Sans, Geologica } from "next/font/google"

// providers
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider, TRPCProvider, WidgetModalProvider } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

// styles
import { dark } from "@clerk/themes"
import "@/app/globals.css"

// utils
import { cn } from "@/lib/utils"

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: '--font-josefin'
})

const geologica = Geologica({
  subsets: ["latin"],
  variable: '--font-geologica'
})

export const metadata: Metadata = {
  title: "Memory PvP",
  description: "A simple memory card game with additional PvP features."
}

const BaseLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
      appearance={{ baseTheme: dark }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-body antialiased", josefin.variable, geologica.variable)}>
          <TRPCProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              storageKey="memory-theme"
              enableSystem
            >
              <WidgetModalProvider />
              <Toaster />

              {children}
            </ThemeProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default BaseLayout
