import PomodoroMode from './PomodoroMode'
import ToggleModeBttn from './ToggleModeBttn'
import StopwatchMode from '../stopwatch/component/StopwatchMode'
import TimerSettingsButton from '../timer-setting/components/TimerSettingBttn'
import { useState } from 'react'
import { usePomodoroStore } from '../store/usePomdoroStore'
import { Card, CardContent } from '@/components/card/ui/card'

export const PomodoroWidget = () => {
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro')
  const { setShowSettings } = usePomodoroStore()
  return (
    <Card className="flex flex-col items-center p-5 w-full rounded-2xl">
      <CardContent className="gap-1 flex flex-row py-1">
        <ToggleModeBttn
          currentMode={mode}
          onToggle={() => setMode(mode === 'pomodoro' ? 'stopwatch' : 'pomodoro')}
        />
        <TimerSettingsButton onClick={() => setShowSettings(true)} />
      </CardContent>

      {mode === 'pomodoro' ? <PomodoroMode /> : <StopwatchMode />}
    </Card>
  )
}
