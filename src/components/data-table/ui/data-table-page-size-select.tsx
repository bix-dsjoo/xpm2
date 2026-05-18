import { useState } from "react"
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
import { PAGE_SIZE_OPTIONS } from "@/base/model/pagination"

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
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
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
