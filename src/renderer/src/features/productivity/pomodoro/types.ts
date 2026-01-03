export type TimerPhase = 'pomodoro' | 'shortBreak' | 'longBreak'

export type DisplayTimeProps = {
  seconds: number
}

export type PomodoroControlProps = {
  isRunning: boolean
  startTimer: () => void
  pauseTimer: () => void
  restartTimer: () => void
  endTimer: () => void
}

export type PomodoroEvent = {
  id: number
  phase: 'focus' | 'break'
  startedAt: Date
  endedAt: Date
  durationSec: number
  completed: boolean // true only when timer reached 0
  taskId?: number | null // optional, future proofing
}
