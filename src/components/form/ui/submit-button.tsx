import type { ReactNode } from "react"
import { useFormContext } from "../model/form-context"
import { Button } from "@/base/ui/button"

type SubmitButtonProps = {
  children?: ReactNode
}

export function SubmitButton({ children = "Submit" }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Submitting..." : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
