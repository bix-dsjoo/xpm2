import { Button } from "@/base/ui/button"
import type { FormConfig } from "../model/types"
import { useForm } from "@tanstack/react-form"

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
  const form = useForm({
    defaultValues: {
      ...config.defaultValues,
      ...initialValues,
    } as TValues,

    validators: {
      onSubmit: config.schema,
    },

    onSubmit: async ({ value }) => {
      await onSubmit(value as TValues)
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      {config.fields.map((fieldConfig) => (
        <form.Field name={fieldConfig.name} children={() => {}} />
      ))}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "저장 중..." : (config.submitLabel ?? "저장")}
          </Button>
        )}
      />
    </form>
  )
}
