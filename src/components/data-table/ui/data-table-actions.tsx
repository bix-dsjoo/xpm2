import { Button } from "@/base/ui/button"
import { DownloadIcon, UploadIcon } from "lucide-react"

export function DataTableActions() {
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline">
        <DownloadIcon />
      </Button>

      <Button size="icon" variant="outline">
        <UploadIcon />
      </Button>
    </div>
  )
}
