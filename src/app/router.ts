import { createBrowserRouter } from "react-router"

import { DevicesPage } from "@/pages/devices"
import { MainPage } from "@/pages/main"
import { SettingsPage } from "@/pages/settings"
import Layout from "./layout"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: MainPage },
      { path: "devices", Component: DevicesPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
])
