import { useState } from 'react'
import { SortOptions } from '../hooks/useSortedTasks'

type TaskSortSelectorProps = {
  value: SortOptions
  onChange: (value: SortOptions) => void
}

const options: { label: string; value: SortOptions }[] = [
  { label: 'My order', value: '' },
  { label: 'Date', value: 'date' },
  { label: 'Priority', value: 'priority' },
  { label: 'Title', value: 'title' }
]

export const TaskSortSelector = ({ value, onChange }: TaskSortSelectorProps) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block text-right">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm border rounded px-1 py-1 text-[#6a5555] border-lightgreen bg-white shadow-sm w-20"
      >
        Sort by
      </button>
      {open && (
        <div className="absolute left-3 mt-2 w-40 bg-white border-lightgreen border-[0.05rem] rounded shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full text-left px-3 gap-1 space-x-1 py-2 border-lightgreen text-sm hover:bg-lightbeige ${
                value === opt.value
                  ? 'font-bold bg-lightgreen/40 gap-1 text-[#6a5555]'
                  : 'text-[#4a3e3e] ml-2'
              }`}
            >
              {value === opt.value ? '✓ ' : ''}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
