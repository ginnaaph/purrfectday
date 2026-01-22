import { Card, CardContent, CardHeader, CardTitle } from '@/components/card/ui/card'

type DailyProgressCardProps = {
  tasksCompleted: number
  tasksTotal: number
  habitsCompleted?: number
  habitsTotal?: number
  focusMinutes?: number
  focusGoalMinutes?: number
}

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)))

export const DailyProgressCard = ({
  tasksCompleted,
  tasksTotal,
  habitsCompleted = 0,
  habitsTotal = 0,
  focusMinutes = 0,
  focusGoalMinutes = 0
}: DailyProgressCardProps) => {
  const taskPercent = tasksTotal ? clampPercent((tasksCompleted / tasksTotal) * 100) : 0
  const habitPercent = habitsTotal ? clampPercent((habitsCompleted / habitsTotal) * 100) : 0
  const focusPercent = focusGoalMinutes ? clampPercent((focusMinutes / focusGoalMinutes) * 100) : 0

  const focusLabel = focusMinutes
    ? `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m`
    : '0h 0m'
  const taskLabel = `${tasksCompleted}/${tasksTotal || 0}`
  const habitLabel = `${habitsCompleted}/${habitsTotal || 0}`

  return (
    <Card className="mt-2 gap-2">
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-primary-alt">
            <span>Tasks</span>
            <span className="text-primary-alt/70">{taskLabel}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-primary-alt/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-alt/60 transition-all duration-500 ease-in-out"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-primary-alt">
            <span>Habits</span>
            <span className="text-primary-alt/70">{habitLabel}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-primary-alt/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-alt/60 transition-all duration-500 ease-in-out"
              style={{ width: `${habitPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-primary-alt">
            <span>Focus Time</span>
            <span className="text-primary-alt/70">{focusLabel}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-primary-alt/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-alt/60 transition-all duration-500 ease-in-out"
              style={{ width: `${focusPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
