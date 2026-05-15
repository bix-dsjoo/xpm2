type DataTableTitleProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

export function DataTableTitle({ title, description }: DataTableTitleProps) {
  return (
    <div className="flex items-center gap-1">
      <h2 className="text-sm font-medium">{title}</h2>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
