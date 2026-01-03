import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import catImg from '@/assets/images/cat/sittingCat.png'
import PomodoroMode from '../pomodoro/components/PomodoroMode'
import StopwatchMode from '../pomodoro/stopwatch/component/StopwatchMode'

import ToggleModeBttn from '../pomodoro/components/ToggleModeBttn'
import TimerSettingsButton from '../pomodoro/timer-setting/components/TimerSettingBttn'
import { usePomodoroStore } from '../pomodoro/store/usePomdoroStore'
import { TimerSettingsModal } from '../pomodoro/timer-setting/components/TimerSettingsModal'
import { useFocusTaskStore } from '../tasks/store/useFocusTaskStore'

export const PomodoroPg = () => {
  const location = useLocation()
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro')
  const focusFromTaskList = Boolean(location.state?.fromTaskList)
  const { clearFocusedTask, setFocusedTaskId } = useFocusTaskStore()

  const {
    focusTime,
    shortBreakTime,
    longBreakTime,
    showSettings,
    setShowSettings,
    applyTimerSettings
  } = usePomodoroStore()
  useEffect(() => {
    if (!focusFromTaskList) {
      clearFocusedTask()
    } else {
      const saved = localStorage.getItem('focusedTask')
      if (saved) setFocusedTaskId(JSON.parse(saved))
    }
  }, [focusFromTaskList, clearFocusedTask, setFocusedTaskId])
  return (
    <div className="flex flex-col justify-center items-center overflow-x-hidden gap-4 p-10 pt-50">
      <div className="flex flex-col items-center space-y-4  ">
        <div className="gap-2 flex flex-row">
          <ToggleModeBttn
            currentMode={mode}
            onToggle={() => setMode(mode === 'pomodoro' ? 'stopwatch' : 'pomodoro')}
          />

          <TimerSettingsButton onClick={() => setShowSettings(true)} />
        </div>
        {mode === 'pomodoro' ? <PomodoroMode /> : <StopwatchMode />}
      </div>

      <TimerSettingsModal
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        initialFocus={focusTime}
        initialShort={shortBreakTime}
        initialLong={longBreakTime}
        onSet={(f, s, l) => {
          applyTimerSettings({ focus: f, short: s, long: l })
        }}
      />

      <div>
        <img
          src={catImg}
          alt="Sitting Cat"
          className="absolute bottom-0 right-0 w-32 h-32 opacity-50 pointer-events-none select-none"
        />
      </div>
    </div>
  )
}
