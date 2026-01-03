import { useState } from 'react'
import { Button } from '@/components/ui/button'
// Use a simple close glyph to avoid extra icon deps

type TimerSettingsModalProps = {
  isVisible: boolean
  onClose: () => void
  onSet: (focus: number, shortBreak: number, longBreak: number) => void
  initialFocus: number
  initialShort: number
  initialLong: number
}

export const TimerSettingsModal = ({
  isVisible,
  onClose,
  onSet,
  initialFocus,
  initialShort,
  initialLong
}: TimerSettingsModalProps) => {
  const [focus, setFocus] = useState(initialFocus)
  const [shortBreak, setShortBreak] = useState(initialShort)
  const [longBreak, setLongBreak] = useState(initialLong)
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2">
      <div className="bg-primary-background relative rounded-xl p-10 shadow-lg w-85 text-center text-primary">
        <Button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-4 right-4 text-3xl font-bold text-primary hover:text-primary/50 transition"
          variant="ghost"
        >
          ×
        </Button>

        <div className="text-4xl font-bold mb-6">{focus.toString().padStart(2, '0')}:00</div>

        <div className="space-y-4 text-left">
          <label>
            <span className="block mb-1 font-bold">Focus</span>
            <input
              type="range"
              min="2"
              max="120"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              className="w-full range-custom"
              style={
                {
                  '--progress-percent': `${((focus - 2) / (120 - 2)) * 100}%`
                } as React.CSSProperties
              }
            />
            <div className="text-right">{focus} min</div>
          </label>

          <label>
            <span className="block mb-1 font-bold">Short Break</span>
            <input
              type="range"
              min="1"
              max="20"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
              className="w-full range-custom"
              style={
                {
                  '--progress-percent': `${((shortBreak - 1) / (20 - 1)) * 100}%`
                } as React.CSSProperties
              }
            />
            <div className="text-right">{shortBreak} min</div>
          </label>

          <label>
            <span className="block mb-1 font-bold">Long Break</span>
            <input
              type="range"
              min="10"
              max="45"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
              className="w-full range-custom"
              style={
                {
                  '--progress-percent': `${((longBreak - 10) / (45 - 10)) * 100}%`
                } as React.CSSProperties
              }
            />
            <div className="text-right">{longBreak} min</div>
          </label>
        </div>

        <Button
          onClick={() => {
            onSet(focus, shortBreak, longBreak)
            onClose()
          }}
          variant="default"
        >
          Set
        </Button>
      </div>
    </div>
  )
}
