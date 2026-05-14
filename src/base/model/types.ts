export type OptionVariant =
  | "destructive"
  | "info"
  | "secondary"
  | "success"
  | "warning"
  | "neutral"

export type Option<TValue extends string = string> = {
  value: TValue
  label: string
  variant?: OptionVariant
}
