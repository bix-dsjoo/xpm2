import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { enableMocking } from "./mocks/enable-mocking"
import { QueryProvider } from "@/app/providers/query-provider"
import { ThemeProvider } from "@/app/providers/theme-provider"
import { RouterProvider } from "react-router"
import { router } from "./router"
import { Toaster } from "@/base/ui/sonner"

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
        <Toaster />
      </ThemeProvider>
    </StrictMode>
  )
})
