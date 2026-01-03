import { Button } from '@/components/ui/button'

type ModeToggleButtonProps = {
  currentMode: 'pomodoro' | 'stopwatch'
  onToggle: () => void
}
export default function ToggleModeBttn({ currentMode, onToggle }: ModeToggleButtonProps) {
  const label = currentMode === 'pomodoro' ? 'stopwatch' : 'pomodoro'
  return (
    <Button variant="outline"  onClick={onToggle}>
      {label}
    </Button>
  )
}
