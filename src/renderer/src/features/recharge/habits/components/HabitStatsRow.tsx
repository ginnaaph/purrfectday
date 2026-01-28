import { Flame, Trophy } from 'lucide-react'

type HabitStatsRowProps = {
  completedToday: number
  totalToday: number
}

export const HabitStatsRow = ({ completedToday, totalToday }: HabitStatsRowProps) => {
  const completionRate = totalToday ? Math.round((completedToday / totalToday) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-2 space-y-2 text-center text-sm text-primary/80 mb-2 mt-2">
      <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
        <Flame className="h-4 w-4" />
        <span>{completedToday} streak</span>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
        <Trophy className="h-4 w-4" />
        <span>{totalToday} best</span>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-2 py-2">
        <span className="font-semibold">{completionRate}%</span>
        <span>rate</span>
      </div>
    </div>
  )
}
