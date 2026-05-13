import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/base/ui/field"
import { useFieldContext } from "../model/form-context"
import { Textarea } from "@/base/ui/textarea"

type TextareaFieldProps = {
  label: string
  placeholder?: string
  description?: string
}

export function TextareaField({
  label,
  placeholder,
  description,
}: TextareaFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        className="resize-none"
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
