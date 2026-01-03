import { useEffect } from 'react'
import { usePomodoroStore } from '../store/usePomdoroStore'

export const usePomodoroTimer = () => {
  const { isRunning, timeLeft, phase, completePhase } = usePomodoroStore()
  const setTimeLeft = usePomodoroStore((s) => s.setTimeLeft)

  useEffect(() => {
    const shouldRun = isRunning && timeLeft > 0
    let timer: ReturnType<typeof setInterval> | null = null

    if (shouldRun) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1
          return next < 0 ? 0 : next
        })
      }, 1000)
    }

    if (isRunning && timeLeft === 0) {
      completePhase()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft, phase, setTimeLeft, completePhase])
}
