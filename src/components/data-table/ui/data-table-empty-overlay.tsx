import { EmptyData } from "@/base/ui/empty-data"
import type { LucideIcon } from "lucide-react"

type DataTableEmptyOverlayProps = {
  Icon?: LucideIcon
  title?: string
  description?: string
}

export function DataTableEmptyOverlay({
  Icon,
  title,
  description,
}: DataTableEmptyOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <EmptyData Icon={Icon} title={title} description={description} />
    </div>
  )
}
