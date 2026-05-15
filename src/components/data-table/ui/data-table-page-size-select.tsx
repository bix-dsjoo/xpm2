import { Button } from "@/base/ui/button"
import { ButtonGroup } from "@/base/ui/button-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/base/ui/select"
import { useState } from "react"

type DataTablePageSizeSelectProps = {
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
}

export function DataTablePageSizeSelect({
  pageSize,
  onPageSizeChange,
}: DataTablePageSizeSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <ButtonGroup>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value))}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="75">75</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        className="text-xs font-normal"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Per Page
      </Button>
    </ButtonGroup>
  )
}
