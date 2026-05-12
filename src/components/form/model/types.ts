import type { z } from "zod"

export type FormConfig<TValues extends Record<string, unknown>> = {
  schema: z.ZodType<TValues, TValues>
  defaultValues: TValues
  fieldSets: FieldSetConfig<TValues>[]
}

export type FieldSetConfig<TValues extends Record<string, unknown>> = {
  legend?: string
  description?: string
  fieldGroups: (FieldGroupConfigs<TValues> | FieldConfig<TValues>)[]
}

export type FieldGroupConfigs<TValues extends Record<string, unknown>> = {
  layout: "grid"
  columns: 2 | 3 | 4
  fields: FieldConfig<TValues>[]
}

type FieldName<TValues extends Record<string, unknown>> = keyof TValues & string

export type FieldConfig<TValues extends Record<string, unknown>> =
  | InputFieldConfig<TValues>
  | TextareaFieldConfig<TValues>
  | SelectFieldConfig<TValues>
  | CheckboxFieldConfig<TValues>
  | SwitchFieldConfig<TValues>

export type BaseFieldConfig<TValues extends Record<string, unknown>> = {
  name: FieldName<TValues>
  label: string
  placeholder?: string
  description?: string
  required?: boolean
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

export type CheckboxFieldConfig<TValues extends Record<string, unknown>> =
  BaseFieldConfig<TValues> & {
    type: "checkbox"
  }
