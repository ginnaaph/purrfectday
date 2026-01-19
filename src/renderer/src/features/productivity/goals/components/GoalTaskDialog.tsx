import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/dialog/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/text-area/ui/textArea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { ProjectComboBox } from '@/features/productivity/projects/components/ProjectComboBox'
import type { GoalTaskFormValues } from '../types'

const formatLocalDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDateInput = (value?: string) => {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

type GoalTaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: GoalTaskFormValues) => Promise<void>
  isSaving: boolean
}

export const GoalTaskDialog = ({ open, onOpenChange, onSubmit, isSaving }: GoalTaskDialogProps) => {
  const [dateOpen, setDateOpen] = useState(false)
  const form = useForm<GoalTaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: '',
      tags: '',
      estimatedPomodoros: null,
      dueDate: '',
      project: null
    }
  })

  const dueDateValue = form.watch('dueDate')
  const selectedDate = parseLocalDateInput(dueDateValue)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Goal Task</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values)
            form.reset()
          })}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="goal-task-title">
              Title
            </label>
            <Input id="goal-task-title" {...form.register('title', { required: true })} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="goal-task-description">
              Description
            </label>
            <Textarea id="goal-task-description" rows={3} {...form.register('description')} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="goal-task-priority">
                Priority
              </label>
              <select
                id="goal-task-priority"
                className="h-9 rounded-md border px-3 text-sm"
                {...form.register('priority')}
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="goal-task-estimate">
                Est. Pomodoros
              </label>
              <Input
                id="goal-task-estimate"
                type="number"
                min={0}
                step={1}
                {...form.register('estimatedPomodoros', {
                  setValueAs: (value) => (value === '' || value == null ? null : Number(value))
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="goal-task-tags">
              Tags
            </label>
            <Input id="goal-task-tags" placeholder="work, weekly" {...form.register('tags')} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="goal-task-date">
                Due Date
              </label>
              <input type="hidden" {...form.register('dueDate')} />
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="goal-task-date"
                    type="button"
                    className="w-full justify-between font-normal border-primary border bg-transparent text-primary"
                  >
                    {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    className="rounded-lg"
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        form.setValue('dueDate', formatLocalDateInput(date))
                      } else {
                        form.setValue('dueDate', '')
                      }
                      setDateOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Project</label>
              <ProjectComboBox control={form.control} name="project" />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
