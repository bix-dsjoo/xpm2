import { Button } from "@/base/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/base/ui/field"
import { useForm } from "@tanstack/react-form"
import type { FormConfig } from "../model/types"
import { Checkbox } from "@/base/ui/checkbox"
import { Input } from "@/base/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/base/ui/select"
import { Textarea } from "@/base/ui/textarea"

type FormProps<TValues extends Record<string, unknown>> = {
  config: FormConfig<TValues>
  initialValues?: Partial<TValues>
  onSubmit: (values: TValues) => void | Promise<void>
}

export const Form = <TValues extends Record<string, unknown>>({
  config,
  initialValues,
  onSubmit,
}: FormProps<TValues>) => {
  const defaultValues: TValues = {
    ...config.defaultValues,
    ...initialValues,
  }

  const form = useForm({
    defaultValues,

    validators: {
      onSubmit: config.schema,
    },

    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {config.fields.map((fieldConfig, index) => (
          <form.Field
            key={fieldConfig.name}
            name={fieldConfig.name}
            children={(field) => {
              const fieldId = `${field.name}-field`
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              if (fieldConfig.type === "checkbox")
                return (
                  <>
                    <div>
                      <FieldSet>
                        <FieldLegend variant="label">
                          {fieldConfig.legend}
                        </FieldLegend>
                        {fieldConfig.description && (
                          <FieldDescription>
                            {fieldConfig.description}
                          </FieldDescription>
                        )}
                        <FieldGroup data-slot="checkbox-group">
                          <Field
                            orientation="horizontal"
                            data-invalid={isInvalid}
                          >
                            <Checkbox
                              id={fieldId}
                              name={field.name}
                              checked={field.state.value as boolean}
                              onCheckedChange={(checked) =>
                                field.handleChange((checked === true) as never)
                              }
                            />
                            <FieldLabel
                              htmlFor={fieldId}
                              className="font-normal"
                            >
                              {fieldConfig.label}
                            </FieldLabel>
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                    {index < config.fields.length - 1 && <FieldSeparator />}
                  </>
                )

              return (
                <>
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={fieldId}>
                      {fieldConfig.label}
                    </FieldLabel>
                    {fieldConfig.type === "input" && (
                      <Input
                        id={fieldId}
                        name={field.name}
                        type={fieldConfig.inputType ?? "text"}
                        value={field.state.value as string}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value as never)
                        }
                        aria-invalid={isInvalid}
                        placeholder={fieldConfig.placeholder}
                      />
                    )}
                    {fieldConfig.type === "textarea" && (
                      <Textarea
                        id={fieldId}
                        name={field.name}
                        value={field.state.value as string}
                        rows={fieldConfig.rows}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value as never)
                        }
                        aria-invalid={isInvalid}
                        placeholder={fieldConfig.placeholder}
                      />
                    )}
                    {fieldConfig.type === "select" && (
                      <Select
                        items={fieldConfig.options}
                        value={field.state.value as string}
                        onValueChange={(value) =>
                          field.handleChange(value as never)
                        }
                      >
                        <SelectTrigger
                          id={fieldId}
                          className="w-full"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder={fieldConfig.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {fieldConfig.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                    {fieldConfig.description && (
                      <FieldDescription>
                        {fieldConfig.description}
                      </FieldDescription>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                </>
              )
            }}
          />
        ))}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "저장 중..." : (config.submitLabel ?? "저장")}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
