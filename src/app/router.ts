import { FormPage } from "@/pages/form-page"
import { MainPage } from "@/pages/main-page"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: MainPage },
      { path: "form", Component: FormPage },
    ],
  },
])
