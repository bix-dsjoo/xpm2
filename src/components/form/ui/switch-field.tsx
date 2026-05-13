import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/base/ui/field"
import { useFieldContext } from "../model/form-context"
import { Switch } from "@/base/ui/switch"

type SwitchFieldProps = {
  label: string
  description?: string
}

export function SwitchField({ label, description }: SwitchFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value}
        aria-invalid={isInvalid}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
    </Field>
  )
}
