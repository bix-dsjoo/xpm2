import { Outlet } from "react-router"

import { SidebarProvider } from "@/base/ui/sidebar"
import { AppSidebar } from "@/modules/app-sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
