import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/app/providers/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { router } from "./router.ts"
import { Toaster } from "@/base/ui/sonner.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
