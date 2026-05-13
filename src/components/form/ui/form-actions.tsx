import { Field } from "@/base/ui/field"
import type { ReactNode } from "react"

type FormActionsProps = {
  children: ReactNode
}

export function FormActions({ children }: FormActionsProps) {
  return <Field orientation="horizontal">{children}</Field>
}
