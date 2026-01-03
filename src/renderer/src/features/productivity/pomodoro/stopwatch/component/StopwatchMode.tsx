import { useEffect } from 'react'
import DisplayTime from '../../components/DisplayTime'
import { Button } from '@/components/ui/button'
import useStopwatchStore from '../store/useStopwatchStore'

const StopwatchMode = () => {
  const isRunning = useStopwatchStore((s) => s.isRunning)
  const elapsedTime = useStopwatchStore((s) => s.elapsedTime)
  const start = useStopwatchStore((s) => s.start)
  const pause = useStopwatchStore((s) => s.pause)
  const reset = useStopwatchStore((s) => s.reset)
  const tick = useStopwatchStore((s) => s.tick)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, tick])
  return (
    <div className="flex flex-col items-center space-y-4  p-6">
      <DisplayTime seconds={elapsedTime} />
      <div className="py-7 flex gap-3">
        {!isRunning ? (
          <Button variant="default" onClick={start}>
            Start
          </Button>
        ) : (
          <Button variant="secondary" onClick={pause}>
            Pause
          </Button>
        )}
        <Button variant="destructive" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
export default StopwatchMode
