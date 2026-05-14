import type { Option } from "@/base/model/types"
import { useFieldContext } from "../model/form-context"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/base/ui/select"

type SelectFieldProps = {
  label: string
  placeholder?: string
  description?: string
  options: Option[]
}

export function SelectField({
  label,
  placeholder,
  description,
  options,
}: SelectFieldProps) {
  const field = useFieldContext<string | null>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Select
        name={field.name}
        value={field.state.value}
        items={options}
        onValueChange={field.handleChange}
      >
        <SelectTrigger id={field.name} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
