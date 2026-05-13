import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { enableMocking } from "./mocks/enable-mocking.ts"
import { QueryProvider } from "@/app/providers/query-provider.tsx"
import { ThemeProvider } from "@/app/providers/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { router } from "./router.ts"
import { Toaster } from "@/base/ui/sonner.tsx"

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
