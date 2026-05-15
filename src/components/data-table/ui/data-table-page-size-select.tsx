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

export function DataTablePageSizeSelect() {
  return (
    <ButtonGroup>
      <Select defaultValue="25">
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

      <Button className="text-xs font-normal" variant="outline">
        Per Page
      </Button>
    </ButtonGroup>
  )
}
