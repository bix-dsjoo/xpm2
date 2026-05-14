import { createBrowserRouter } from "react-router"

import { DevicesPage } from "@/pages/devices"
import { MainPage } from "@/pages/main"
import { SettingsPage } from "@/pages/settings"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: MainPage },
      { path: "devices", Component: DevicesPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
])
