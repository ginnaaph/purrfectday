import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTaskDetailData } from '../hooks/useTaskDetailData'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/text-area/ui/textArea'
import { Button } from '@/components/ui/button'
import { useTaskModalStore } from '../store/useTaskModalStore'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Label } from '@/components/label/ui/label'
import { ChevronDownIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/dialog/ui/dialog'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().optional(),
  estimatedPomodoros: z.number().nullable().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional()
})
type TaskDetailsFormInput = z.infer<typeof schema>

export const TaskDetails = ({ taskId }: { taskId: number | null }) => {
  const isOpen = useTaskModalStore((s) => s.isOpen)
  const selectedTaskId = useTaskModalStore((s) => s.selectedTaskId)
  const close = useTaskModalStore((s) => s.close)
  const { task, updateTaskMutation } = useTaskDetailData(taskId)
  const [dateOpen, setDateOpen] = useState(false)

  const form = useForm<TaskDetailsFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: undefined,
      tags: '',
      estimatedPomodoros: null,
      dueDate: ''
    }
  })

  useEffect(() => {
    if (!task) return
    form.reset({
      title: task.title ?? '',
      description: task.description ?? '',
      priority: task.priority ?? undefined,
      tags: (task.tags ?? []).join(', '),
      estimatedPomodoros:
        typeof task.estimatedPomodoros === 'number' ? task.estimatedPomodoros : null,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ''
    })
    if (task.dueDate) {
      const d = new Date(task.dueDate)
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      form.setValue('dueTime', `${hh}:${mm}:${ss}`)
    } else {
      form.setValue('dueTime', '')
    }
  }, [task, form])

  function onSubmit(values: TaskDetailsFormInput) {
    if (!selectedTaskId) return

    // Combine local date + time into a Date
    let combinedDue: Date | null = null
    if (values.dueDate) {
      const d = new Date(values.dueDate)
      if (values.dueTime) {
        const [h, m = '0', s = '0'] = values.dueTime.split(':')
        d.setHours(Number(h || 0), Number(m || 0), Number(s || 0), 0)
      } else {
        d.setHours(0, 0, 0, 0)
      }
      combinedDue = d
    }

    const updates = {
      title: values.title,
      description: values.description ?? undefined,
      priority: values.priority ?? null,
      tags: values.tags ?? '',
      estimated_pomodoros:
        typeof values.estimatedPomodoros === 'number' ? values.estimatedPomodoros : null,
      dueDate: combinedDue
    }

    updateTaskMutation.mutate(
      { taskId: selectedTaskId, updates },
      {
        onSuccess: () => {
          close()
        }
      }
    )
  }

  const open = isOpen && !!selectedTaskId && selectedTaskId === taskId
  const dueDateStr = form.getValues('dueDate')
  const selectedDate = dueDateStr ? new Date(dueDateStr) : undefined

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? close() : null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Form className="space-y-4">
          <FormItem>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl>
              <Input
                id="title"
                {...form.register('title')}
                aria-invalid={!!form.formState.errors.title}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.title?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl>
              <Textarea id="description" rows={4} {...form.register('description')} />
            </FormControl>
            <FormMessage>{form.formState.errors.description?.message}</FormMessage>
          </FormItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormItem>
              <FormLabel>Due</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="date-picker" className="px-1">
                      Date
                    </Label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-40 justify-between font-normal"
                        >
                          {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                          <ChevronDownIcon className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          captionLayout="dropdown"
                          onSelect={(d) => {
                            if (d) {
                              const iso = new Date(d).toISOString().slice(0, 10)
                              form.setValue('dueDate', iso)
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
                    <Label htmlFor="time-picker" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      {...form.register('dueTime')}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      form.setValue('dueDate', '')
                      form.setValue('dueTime', '')
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="priority">Priority</FormLabel>
              <FormControl>
                <select
                  id="priority"
                  className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none"
                  {...form.register('priority')}
                >
                  <option value="">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </FormControl>
              <FormMessage>{form.formState.errors.priority?.toString()}</FormMessage>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormItem>
              <FormLabel htmlFor="estimatedPomodoros">Est. Pomodoros</FormLabel>
              <FormControl>
                <Input
                  id="estimatedPomodoros"
                  type="number"
                  min={0}
                  step={1}
                  {...form.register('estimatedPomodoros', {
                    setValueAs: (v) => (v === '' || v === null ? null : Number(v))
                  })}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.estimatedPomodoros?.toString()}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="tags">Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input id="tags" placeholder="work, urgent" {...form.register('tags')} />
              </FormControl>
              <FormMessage>{form.formState.errors.tags?.toString()}</FormMessage>
            </FormItem>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => close()}
              disabled={updateTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit as (v: TaskDetailsFormInput) => void)}
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
