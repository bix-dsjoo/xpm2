import { CompositionFormPage, ConfigFormPage } from "@/pages/form-page"
import { MainPage } from "@/pages/main-page"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: MainPage },
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
