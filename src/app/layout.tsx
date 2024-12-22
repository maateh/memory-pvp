import type { Metadata } from "next"
import { Josefin_Sans, Geologica } from "next/font/google"

// providers
import { ClerkProvider } from "@clerk/nextjs"
import { SocketServiceProvider, ThemeProvider, TRPCProvider } from "@/components/provider"
import { Toaster } from "@/components/ui/sonner"

// uploadthing
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { uploadRouter } from "@/server/uploadthing/core"

// styles
import { dark } from "@clerk/themes"
import "@/app/globals.css"

// utils
import { cn } from "@/lib/util"

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

type BaseLayoutProps = {
  children: React.ReactNode
  popup: React.ReactNode
}

const BaseLayout = ({ children, popup }: BaseLayoutProps) => {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
      appearance={{ baseTheme: dark }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-body antialiased", josefin.variable, geologica.variable)}>
          <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />

          <TRPCProvider>
            <SocketServiceProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                storageKey="memory-theme"
                enableSystem
              >
                <Toaster />

                {popup}
                {children}
              </ThemeProvider>
            </SocketServiceProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default BaseLayout
