import { Field, FieldError, FieldLabel } from "@/base/ui/field"
import { useFieldContext } from "../model/form-context"
import { Checkbox } from "@/base/ui/checkbox"

type CheckboxFieldProps = {
  label: string
}

export function CheckboxField({ label }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => {
          field.handleChange(checked === true)
        }}
      />

      <FieldLabel htmlFor={field.name} className="font-normal">
        {label}
      </FieldLabel>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
