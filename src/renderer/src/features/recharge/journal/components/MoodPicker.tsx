import type { Moods } from '../../journal/types'

type MoodPickerProps = {
  value: Moods | null
  onChange: (mood: Moods) => void
}

export const MoodPicker = ({ value, onChange }: MoodPickerProps) => {
  const moods = ['🙂', '😐', '🙁'] as const
  return (
    <div className=" rounded-lg shadow-sm p-1 items-left bg-blue/40">
      <div>How are you feeling today?</div>
      <div className="flex flex-row">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => onChange(mood)}
            className={`text-xl p-2 rounded-xl transition-all ${
              value === mood ? 'bg-primary/20 scale-110' : 'hover:bg-accent/50'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  )
}
