import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/base/ui/field"
import type { ReactNode } from "react"

type FormFieldSetProps = {
  legend?: ReactNode
  description?: ReactNode
  children: ReactNode
}

export function FormFieldSet({
  legend,
  description,
  children,
}: FormFieldSetProps) {
  return (
    <FieldSet>
      {legend && <FieldLegend>{legend}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup className="mt-4">{children}</FieldGroup>
    </FieldSet>
  )
}
