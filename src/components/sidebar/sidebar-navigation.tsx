"use client"

// clerk
import { SignedIn } from "@clerk/nextjs"

// constants
import { routes } from "@/constants/navigation"

// components
import SidebarNavigationItem from "@/components/sidebar/sidebar-navigation-item"

const SidebarNavigation = () => {
  return (
    <ul className="flex-1 space-y-4">
      <SignedIn>
        {routes.protected.map((route) => (
          <SidebarNavigationItem
            route={route}
            key={route.href}
          />
        ))}
      </SignedIn>

      {routes.public.map((route) => (
        <SidebarNavigationItem
          route={route}
          key={route.href}
        />
      ))}
    </ul>
  )
}

export default SidebarNavigation
