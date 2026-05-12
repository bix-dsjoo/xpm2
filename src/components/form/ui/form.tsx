import { Button } from "@/base/ui/button"
import { Checkbox } from "@/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/base/ui/field"
import { Input } from "@/base/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/base/ui/select"
import { Switch } from "@/base/ui/switch"
import { Textarea } from "@/base/ui/textarea"
import { useForm } from "@tanstack/react-form"
import { Fragment, useId } from "react"
import type { FieldConfig, FormConfig } from "../model/types"

const gridColumnClassName = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const

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
  const formId = useId()

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

  function FormField({ fieldConfig }: { fieldConfig: FieldConfig<TValues> }) {
    return (
      <form.Field
        name={fieldConfig.name}
        children={(field) => {
          const fieldId = `${formId}${field.name}`
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          const value = field.state.value

          if (fieldConfig.type === "checkbox") {
            return (
              <Field data-invalid={isInvalid} orientation="horizontal">
                <Checkbox
                  id={fieldId}
                  name={field.name}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as never)
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <FieldLabel htmlFor={fieldId} className="font-normal">
                  {fieldConfig.label}
                </FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }

          if (fieldConfig.type === "switch") {
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={fieldId}>{fieldConfig.label}</FieldLabel>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Switch
                  id={fieldId}
                  name={field.name}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) =>
                    field.handleChange(Boolean(checked) as never)
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
              </Field>
            )
          }

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel className="gap-1" htmlFor={fieldId}>
                {fieldConfig.label}
                {fieldConfig.required && (
                  <span aria-hidden="true" className="text-destructive">
                    *
                  </span>
                )}
              </FieldLabel>
              {fieldConfig.type === "input" && (
                <Input
                  id={fieldId}
                  name={field.name}
                  type={fieldConfig.inputType}
                  value={String(value)}
                  placeholder={fieldConfig.placeholder}
                  onChange={(event) =>
                    field.handleChange(event.target.value as never)
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
              )}
              {fieldConfig.type === "textarea" && (
                <Textarea
                  id={fieldId}
                  name={field.name}
                  rows={fieldConfig.rows}
                  value={String(value)}
                  placeholder={fieldConfig.placeholder}
                  className="resize-none"
                  onChange={(event) =>
                    field.handleChange(event.target.value as never)
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
              )}
              {fieldConfig.type === "select" && (
                <Select
                  value={value}
                  items={fieldConfig.options}
                  onValueChange={(value) => field.handleChange(value as never)}
                >
                  <SelectTrigger
                    id={fieldId}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  >
                    <SelectValue placeholder={fieldConfig.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fieldConfig.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {fieldConfig.description && !isInvalid && (
                <FieldDescription>{fieldConfig.description}</FieldDescription>
              )}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
    )
  }

  return (
    <form
      className="w-full sm:max-w-lg"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        {config.fieldSets.map((fieldSet, index) => (
          <Fragment key={`${formId}fieldset_${index}`}>
            {index > 0 && <FieldSeparator />}
            <FieldSet>
              {fieldSet.legend && <FieldLegend>{fieldSet.legend}</FieldLegend>}
              {fieldSet.description && (
                <FieldDescription>{fieldSet.description}</FieldDescription>
              )}
              <form.Subscribe
                selector={(state) => state.values}
                children={(values) => (
                  <FieldGroup>
                    {fieldSet.fieldGroups.map((fieldGroup, index) => {
                      if (fieldGroup.visibleWhen?.(values) === false) {
                        return null
                      }

                      if ("layout" in fieldGroup) {
                        const visibleFields = fieldGroup.fields.filter(
                          (fieldConfig) =>
                            fieldConfig.visibleWhen?.(values) !== false
                        )

                        if (visibleFields.length === 0) {
                          return null
                        }

                        return (
                          <div
                            className={`grid ${gridColumnClassName[fieldGroup.columns]} gap-4`}
                            key={`${formId}grid_${index}`}
                          >
                            {visibleFields.map((fieldConfig) => (
                              <FormField
                                key={`${formId}field_${fieldConfig.name}`}
                                fieldConfig={fieldConfig}
                              />
                            ))}
                          </div>
                        )
                      }

                      return (
                        <FormField
                          key={`${formId}field_${fieldGroup.name}`}
                          fieldConfig={fieldGroup}
                        />
                      )
                    })}
                  </FieldGroup>
                )}
              />
            </FieldSet>
          </Fragment>
        ))}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Field orientation="horizontal">
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                type="reset"
                onClick={(e) => {
                  e.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </Button>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
