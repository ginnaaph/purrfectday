import { Button } from '@/components/ui/button'
type PomodoroControlBttnProps = {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export const PomodoroControlBttn = ({
  isRunning,
  onStart,
  onPause,
  onReset
}: PomodoroControlBttnProps) => {
  return (
    <div className="flex space-x-4">
      {isRunning ? (
        <Button variant="secondary" onClick={onPause}>
          Pause
        </Button>
      ) : (
        <Button variant="default" onClick={onStart}>
          Start
        </Button>
      )}
      <Button variant="destructive" onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
