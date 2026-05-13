import { CompositionFormPage, ConfigFormPage } from "@/pages/form-page"
import { DevicesPage } from "@/pages/devices"
import { MainPage } from "@/pages/main-page"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: MainPage },
      { path: "devices", Component: DevicesPage },
      {
        path: "form",
        children: [
          { path: "config", Component: ConfigFormPage },
          { path: "composition", Component: CompositionFormPage },
        ],
      },
    ],
  },
])
