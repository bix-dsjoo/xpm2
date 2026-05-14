import type { ComponentProps } from "react"

import { Input } from "@/base/ui/input"

import { useFieldContext } from "../model/form-context"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/base/ui/field"

type TextFieldProps = {
  label: string
  description?: string
  required?: boolean
} & Pick<ComponentProps<typeof Input>, "type" | "placeholder" | "autoComplete">

export function TextField({
  label,
  description,
  required,
  type = "text",
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const field = useFieldContext<string | number>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="gap-1">
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        )}
      </FieldLabel>

      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={(event) => {
          if (type === "number") {
            field.handleChange(event.target.valueAsNumber)
            return
          }
          field.handleChange(event.target.value)
        }}
      />

      {description && !isInvalid && (
        <FieldDescription>{description}</FieldDescription>
      )}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
