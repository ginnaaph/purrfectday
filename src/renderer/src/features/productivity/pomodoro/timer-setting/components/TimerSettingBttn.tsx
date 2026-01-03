import { Button } from '@/components/ui/button'
type TimerSettingsProps = {
  onClick: () => void
}

export default function TimerSettingsButton({ onClick }: TimerSettingsProps) {
  return (
    <Button variant="default" onClick={onClick}>
      {' '}
      ⏱ settings
    </Button>
  )
}
