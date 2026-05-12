import type { z } from "zod"

export type FormConfig<TValues extends Record<string, unknown>> = {
  schema: z.ZodType<TValues, TValues>
  defaultValues: TValues
  fields: FieldConfig<TValues>[]
  submitLabel?: string
}

export type FieldName<TValues extends Record<string, unknown>> = keyof TValues &
  string

type StringFieldName<TValues extends Record<string, unknown>> = {
  [TName in FieldName<TValues>]: TValues[TName] extends string ? TName : never
}[FieldName<TValues>]

type BooleanFieldName<TValues extends Record<string, unknown>> = {
  [TName in FieldName<TValues>]: TValues[TName] extends boolean ? TName : never
}[FieldName<TValues>]

export type FieldConfig<TValues extends Record<string, unknown>> = {
  [TName in FieldName<TValues>]: TValues[TName] extends boolean
    ? CheckboxFieldConfig<TValues, TName>
    : TValues[TName] extends string
      ?
          | InputFieldConfig<TValues, TName>
          | TextareaFieldConfig<TValues, TName>
          | SelectFieldConfig<TValues, TName>
      : never
}[FieldName<TValues>]

export type BaseFieldConfig<
  TValues extends Record<string, unknown>,
  TName extends FieldName<TValues>,
> = {
  name: TName
  label: string
  placeholder?: string
  description?: string
}
export type InputFieldConfig<
  TValues extends Record<string, unknown>,
  TName extends FieldName<TValues> = StringFieldName<TValues>,
> = BaseFieldConfig<TValues, TName> & {
  type: "input"
  inputType?: "text" | "email" | "password"
}

export type TextareaFieldConfig<
  TValues extends Record<string, unknown>,
  TName extends FieldName<TValues> = StringFieldName<TValues>,
> = BaseFieldConfig<TValues, TName> & {
  type: "textarea"
  rows?: number
}

export type SelectFieldConfig<
  TValues extends Record<string, unknown>,
  TName extends FieldName<TValues> = StringFieldName<TValues>,
> = BaseFieldConfig<TValues, TName> & {
  type: "select"
  options: Array<{
    label: string
    value: TValues[TName] & string
  }>
}

export type CheckboxFieldConfig<
  TValues extends Record<string, unknown>,
  TName extends FieldName<TValues> = BooleanFieldName<TValues>,
> = BaseFieldConfig<TValues, TName> & {
  type: "switch"
}
