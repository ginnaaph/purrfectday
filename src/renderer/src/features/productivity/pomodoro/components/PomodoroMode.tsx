import { useEffect } from 'react'
import { usePomodoroStore } from '@/features/productivity/pomodoro/store/usePomdoroStore'
import { usePomodoroTimer } from '../hooks/usePomodroTimer'
import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'
import { useLoadTasksIfEmpty } from '@/features/productivity/tasks/hooks/useLoadTasksIfEmpty'
import { Button } from '@/components/ui/button'
import DisplayTime from './DisplayTime'
import TaskSelect from '@/features/productivity/tasks/components/TaskSelect'
import FocusPanel from '@/features/productivity/tasks/components/FocusPanel'

type PomodoroModeProps = {
  onSwitchToStopwatch?: () => void
}

const PomodoroMode = ({ onSwitchToStopwatch }: PomodoroModeProps) => {
  usePomodoroTimer()

  const { phase, isRunning, timeLeft, start, pause, reset, endEarly } = usePomodoroStore()
  const { tasks } = useLoadTasksIfEmpty()
  const activeTaskId = useTaskStore((s) => s.activeTaskId)
  const setActiveTaskId = useTaskStore((s) => s.setActiveTaskId)
  const activeTask = (tasks ?? []).find((t) => t.id === activeTaskId) || null

  // Rehydrate active task id from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('activeTaskId')
    if (saved) {
      const parsed = Number(saved)
      setActiveTaskId(Number.isFinite(parsed) ? parsed : null)
    }
  }, [setActiveTaskId])

  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('activeTaskId', String(activeTaskId))
    } else {
      localStorage.removeItem('activeTaskId') // clear when user unselects
    }
  }, [activeTaskId])

  return (
    <div className="flex flex-col items-center gap-6 mb-6">
      <div className="flex mt-4 flex-col items-center">
        {/* Focused Task Display or Selector */}
        {phase === 'pomodoro' ? (
          !activeTask ? (
            <TaskSelect />
          ) : (
            <FocusPanel />
          )
        ) : (
          <h2>Break time!</h2>
        )}

        {/* Timer */}
        <DisplayTime seconds={timeLeft} />
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3 mb-3">
        {!isRunning ? (
          <Button onClick={start} variant="default">
            Start
          </Button>
        ) : (
          <Button onClick={pause} variant="secondary">
            Pause
          </Button>
        )}

        <Button onClick={reset} variant="outline">
          Reset
        </Button>

        <Button
          onClick={() => {
            const confirmed = window.confirm('End your session early?')
            if (confirmed) endEarly()
          }}
          variant="destructive"
        >
          End
        </Button>

        {onSwitchToStopwatch && (
          <Button onClick={onSwitchToStopwatch} variant="ghost">
            Switch to Stopwatch
          </Button>
        )}
      </div>
    </div>
  )
}

export default PomodoroMode
