import type { Option } from "@/base/model/types"
import type z from "zod"

export type FormConfig<TValues extends Record<string, unknown>> = {
  schema: z.ZodType<unknown, TValues>
  defaultValues: TValues
  fields: FieldConfig<TValues>[]
  submitLabel?: string
}

export type FieldName<TValues extends Record<string, unknown>> = keyof TValues &
  string

export type FieldConfig<TValues extends Record<string, unknown>> =
  | InputFieldConfig<TValues>
  | TextareaFieldConfig<TValues>
  | SelectFieldConfig<TValues>
  | CheckboxFieldConfig<TValues>

export type BaseFieldConfig<TValues extends Record<string, unknown>> = {
  name: FieldName<TValues>
  label: string
  placeholder?: string
  legend?: string
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
    options: Option[]
  }

export type CheckboxFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "checkbox"
  }
