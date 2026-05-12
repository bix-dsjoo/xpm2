import { Button } from "@/base/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/base/ui/field"
import { useForm } from "@tanstack/react-form"
import type { FormConfig } from "../model/types"
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
import { useId } from "react"
import { Switch } from "@/base/ui/switch"

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
        {config.fields.map((fieldConfig) => (
          <form.Field
            key={fieldConfig.name}
            name={fieldConfig.name}
            children={(field) => {
              const fieldId = `${formId}${field.name}`
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <>
                  <Field data-invalid={isInvalid} orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor={fieldId}>
                        {fieldConfig.label}
                      </FieldLabel>
                      {fieldConfig.description && (
                        <FieldDescription>
                          {fieldConfig.description}
                        </FieldDescription>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>
                    {fieldConfig.type === "input" && (
                      <Input
                        id={fieldId}
                        name={field.name}
                        type={fieldConfig.inputType}
                        value={field.state.value}
                        placeholder={fieldConfig.placeholder}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
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
                        value={field.state.value}
                        placeholder={fieldConfig.placeholder}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    )}
                    {fieldConfig.type === "select" && (
                      <Select
                        value={field.state.value}
                        items={fieldConfig.options}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger
                          id={fieldId}
                          className="w-full"
                          onBlur={field.handleBlur}
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
                    {fieldConfig.type === "switch" && (
                      <Switch
                        id={fieldId}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
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
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
