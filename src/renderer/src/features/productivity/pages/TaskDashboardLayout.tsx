import { ReactNode } from 'react'

interface TaskDashboardLayoutProps {
  taskList: ReactNode
  timeblock: ReactNode
  pomodoroWidget: ReactNode
}
export function TaskDashboardLayout({
  taskList,
  timeblock,
  pomodoroWidget
}: TaskDashboardLayoutProps) {
  return (
    <div className="h-full min-h-0 w-full bg-background flex flex-row gap-6 pr-4 px-3 py-4 pl-3 rounded-xl overflow-hidden">
      {/* Main (2/3): Calendar*/}
      <div className="w-2/3 flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-0 flex flex-col p-4 border-white bg-white overflow-auto">
          {timeblock}
        </div>
      </div>
      {/* Task List (1/3) */}
      <div className="w-1/3 flex flex-col h-full gap-y-3 min-h-0 justify-between mr-4">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">{taskList}</div>
        <div className="flex flex-col items-center py-2 shrink-0">{pomodoroWidget}</div>
      </div>
    </div>
  )
}
