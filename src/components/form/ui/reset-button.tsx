import type { ReactNode } from "react"
import { useFormContext } from "../model/form-context"
import { Button } from "@/base/ui/button"

type ResetButtonProps = {
  children?: ReactNode
}

export function ResetButton({ children = "Reset" }: ResetButtonProps) {
  const form = useFormContext()

  return (
    <Button type="button" variant="outline" onClick={() => form.reset()}>
      {children}
    </Button>
  )
}
