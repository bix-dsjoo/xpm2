import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty"

type EmptyDataProps = {
  Icon: LucideIcon
  title?: string
  description?: string
  content?: ReactNode
  className?: string
}

export const EmptyData = ({
  Icon,
  title = "No data",
  description = "No data found",
  content,
  className,
}: EmptyDataProps) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>

        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      {content != null && (
        <EmptyContent className="flex-row justify-center gap-2">
          {content}
        </EmptyContent>
      )}
    </Empty>
  )
}
