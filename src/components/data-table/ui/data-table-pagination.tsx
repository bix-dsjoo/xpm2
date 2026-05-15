import { Button } from "@/base/ui/button"
import { ButtonGroup } from "@/base/ui/button-group"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"

export function DataTablePagination() {
  return (
    <ButtonGroup>
      <Button className="text-muted-foreground" variant="outline">
        <MoveLeftIcon />
      </Button>

      <Button className="text-xs font-normal" variant="outline">
        1 of 1
      </Button>

      <Button className="text-muted-foreground" variant="outline">
        <MoveRightIcon />
      </Button>
    </ButtonGroup>
  )
}
