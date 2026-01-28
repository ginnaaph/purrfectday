import type { ReactNode } from 'react'
import { CardTitle } from '@/components/card/ui/card'

type HabitTrackerHeaderProps = {
  title?: string
  action?: ReactNode
}

export const HabitTrackerHeader = ({
  title = 'Habit Tracker',
  action
}: HabitTrackerHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle>{title}</CardTitle>
      {action}
    </div>
  )
}