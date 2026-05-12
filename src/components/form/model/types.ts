import type { z } from "zod"

export type FormConfig<TValues extends Record<string, unknown>> = {
  schema: z.ZodType<TValues, TValues>
  defaultValues: TValues
  fields: FieldConfig<TValues>[]
  submitLabel?: string
}

type FieldName<TValues extends Record<string, unknown>> = keyof TValues & string

export type FieldConfig<TValues extends Record<string, unknown>> =
  | InputFieldConfig<TValues>
  | TextareaFieldConfig<TValues>
  | SelectFieldConfig<TValues>
  | SwitchFieldConfig<TValues>

export type BaseFieldConfig<TValues extends Record<string, unknown>> = {
  name: FieldName<TValues>
  label: string
  placeholder?: string
  description?: string
}

export type InputFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "input"
    inputType?: "text" | "email" | "password"
  }

export type TextareaFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "textarea"
    rows?: number
  }

export type SelectFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "select"
    options: {
      label: string
      value: string
    }[]
  }

export type SwitchFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "switch"
  }
