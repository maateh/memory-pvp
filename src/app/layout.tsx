import type { Metadata } from "next"
import { Josefin_Sans } from "next/font/google"

// providers
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/providers/theme-provider"

// styles
import "@/app/globals.css"

// utils
import { cn } from "@/lib/utils"

const font = Josefin_Sans({
  subsets: ["latin"],
  variable: '--font-sans'
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
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-sans antialiased", font.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="memory-theme"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default BaseLayout
