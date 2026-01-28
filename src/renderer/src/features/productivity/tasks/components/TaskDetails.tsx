import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useTaskDetailData } from '../hooks/useTaskDetailData'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/text-area/ui/textArea'
import { useTaskModalStore } from '../store/useTaskModalStore'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectComboBox } from '@/features/productivity/projects/components/ProjectComboBox'
import { getAllProjects } from '@/features/productivity/projects/api/getAllProjects.api'
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
  type: z.enum(['task', 'habit']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().optional(),
  estimatedPomodoros: z.number().nullable().optional(),
  project: z
    .object({
      label: z.string(),
      value: z.number()
    })
    .nullable()
    .optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional()
})
type TaskDetailsFormInput = z.infer<typeof schema>

const formatLocalDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDateInput = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const TaskDetails = ({ taskId }: { taskId: number | null }) => {
  const isOpen = useTaskModalStore((s) => s.isOpen)
  const [isEditing, setIsEditing] = useState(false)
  const selectedTaskId = useTaskModalStore((s) => s.selectedTaskId)
  const close = useTaskModalStore((s) => s.close)

  const { task, updateTaskMutation } = useTaskDetailData(taskId)
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
    staleTime: 1000 * 60 * 5
  })

  const [dateOpen, setDateOpen] = useState(false)
  const timeTouchedRef = useRef(false)

  const form = useForm<TaskDetailsFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      type: 'task',
      priority: undefined,
      tags: '',
      estimatedPomodoros: null,
      project: null,
      dueDate: '',
      dueTime: ''
    }
  })

  const open = isOpen && !!selectedTaskId && selectedTaskId === taskId

  // Helper: derive form values from task (single source of truth for resets)
  const getFormValuesFromTask = () => {
    const values: TaskDetailsFormInput = {
      title: task?.title ?? '',
      description: task?.description ?? '',
      type: (task?.type as TaskDetailsFormInput['type']) ?? 'task',
      priority: (task?.priority as TaskDetailsFormInput['priority']) ?? undefined,
      tags: (task?.tags ?? []).join(', '),
      estimatedPomodoros:
        typeof task?.estimatedPomodoros === 'number' ? task.estimatedPomodoros : null,
      project: task?.project_id ? { label: '', value: task.project_id } : null,
      dueDate: task?.dueDate ? formatLocalDateInput(new Date(task.dueDate)) : '',
      dueTime: ''
    }

    if (task?.dueDate) {
      const d = new Date(task.dueDate)
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      values.dueTime = `${hh}:${mm}:${ss}`
    }

    return values
  }

  // When task loads/changes, sync form
  useEffect(() => {
    if (!task) return
    form.reset(getFormValuesFromTask())
    timeTouchedRef.current = false
  }, [task]) // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(values: TaskDetailsFormInput) {
    if (!selectedTaskId) return

    // Combine local date + time into a Date
    let combinedDue: Date | null = null
    if (values.dueDate) {
      const d = parseLocalDateInput(values.dueDate)
      if (!d) return

      const timeToApply = timeTouchedRef.current ? values.dueTime : ''

      if (timeToApply) {
        const [h, m = '0', s = '0'] = timeToApply.split(':')
        d.setHours(Number(h || 0), Number(m || 0), Number(s || 0), 0)
      } else {
        d.setHours(0, 0, 0, 0)
      }
      combinedDue = d
    }

    const updates = {
      title: values.title,
      description: values.description ?? undefined,
      type: values.type ?? 'task',
      priority: values.priority ?? null,
      tags: values.tags ?? '',
      estimated_pomodoros:
        typeof values.estimatedPomodoros === 'number' ? values.estimatedPomodoros : null,
      project_id: values.project?.value ?? null,
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

  // Option 1 cancel: exit edit + revert changes to task values
  const handleCancelEdit = () => {
    if (!task) {
      setIsEditing(false)
      return
    }
    form.reset(getFormValuesFromTask())
    setIsEditing(false)
    timeTouchedRef.current = false
    setDateOpen(false)
  }

  const dueDateStr = form.getValues('dueDate')
  const selectedDate = dueDateStr ? (parseLocalDateInput(dueDateStr) ?? undefined) : undefined
  const selectedProjectName = task?.project_id
    ? projects?.find((project) => project.id === task.project_id)?.name
    : null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setIsEditing(false)
          timeTouchedRef.current = false
          close()
        }
      }}
    >
      <DialogContent className="sm:max-w-lg gap-6">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="font-bold text-xl">
              {isEditing ? 'Edit Task' : form.getValues('title') || 'Untitled Task'}
            </DialogTitle>

            {!isEditing && (
              <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <Form className="gap-4 flex flex-col">
          {/* Title */}
          <FormItem>
            <FormLabel className="text-md " htmlFor="title">
              Title
            </FormLabel>
            <FormControl>
              {isEditing ? (
                <Input
                  className="selection:bg-primary-alt/30"
                  id="title"
                  {...form.register('title')}
                  aria-invalid={!!form.formState.errors.title}
                />
              ) : (
                <div className="border border-transparent h-9 px-3 py-2 rounded-md text-sm leading-5 text-primary-alt bg-secondary-background/50 flex items-center">
                  {form.getValues('title') || (
                    <span className="text-muted-foreground">Enter title</span>
                  )}
                </div>
              )}
            </FormControl>
            <FormMessage>{form.formState.errors.title?.message}</FormMessage>
          </FormItem>

          {/* Description */}
          <FormItem>
            <FormLabel className="text-md " htmlFor="description">
              Description
            </FormLabel>
            <FormControl>
              {isEditing ? (
                <Textarea id="description" rows={4} {...form.register('description')} />
              ) : (
                <div className="border border-transparent min-h-24 px-3 py-2 rounded-md text-sm leading-5 text-primary-alt bg-secondary-background/50 flex items-center">
                  {form.getValues('description') ? (
                    <span className="whitespace-pre-wrap">{form.getValues('description')}</span>
                  ) : (
                    <span className="text-muted-foreground">No description</span>
                  )}
                </div>
              )}
            </FormControl>
            <FormMessage>{form.formState.errors.description?.message}</FormMessage>
          </FormItem>

          {/* Project */}
          <FormItem>
            <FormLabel className="text-md " htmlFor="project">
              Project
            </FormLabel>
            <FormControl>
              {isEditing ? (
                <ProjectComboBox control={form.control} name="project" />
              ) : (
                <div className="border border-transparent h-9 px-3 py-2 rounded-md text-sm leading-5 text-primary-alt bg-secondary-background/50 flex items-center">
                  {selectedProjectName ?? <span className="text-muted-foreground">No project</span>}
                </div>
              )}
            </FormControl>
          </FormItem>

          {/* Type */}
          <FormItem>
            <FormLabel className="text-md " htmlFor="type">
              Type
            </FormLabel>
            <FormControl>
              {isEditing ? (
                <select
                  id="type"
                  className="border-input h-9 w-full rounded-md border px-3 py-1 text-sm outline-none"
                  {...form.register('type')}
                >
                  <option value="task">Task</option>
                  <option value="habit">Habit</option>
                </select>
              ) : (
                <div className="border border-transparent h-9 px-3 py-2 rounded-md text-sm leading-5 text-primary-alt bg-secondary-background/50 flex items-center">
                  {form.getValues('type') === 'habit' ? 'Habit' : 'Task'}
                </div>
              )}
            </FormControl>
            <FormMessage>{form.formState.errors.type?.toString()}</FormMessage>
          </FormItem>

          {/* Due Date / Time / Clear */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <FormItem>
              <FormLabel className="text-md " htmlFor="date-picker">
                Due Date
              </FormLabel>
              <FormControl>
                {isEditing ? (
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
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
                        onSelect={(d) => {
                          if (d) {
                            form.setValue('dueDate', formatLocalDateInput(d))
                          } else {
                            form.setValue('dueDate', '')
                          }
                          setDateOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="h-9 px-3 py-2 rounded-md text-sm leading-5 bg-secondary-background/50 text-primary-alt flex items-center">
                    {selectedDate ? (
                      selectedDate.toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">No due date</span>
                    )}
                  </div>
                )}
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel className="text-md " htmlFor="time-picker">
                Time
              </FormLabel>
              <FormControl>
                {isEditing ? (
                  <Input
                    type="time"
                    id="time-picker"
                    defaultValue="00:00:00"
                    onFocus={() => {
                      timeTouchedRef.current = true
                    }}
                    step="1"
                    {...form.register('dueTime')}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                ) : (
                  <div className="h-9 px-3 py-2 rounded-md text-sm leading-5 bg-secondary-background/50 text-primary-alt flex items-center">
                    {form.getValues('dueTime') ? (
                      form.getValues('dueTime')
                    ) : (
                      <span className="text-muted-foreground">00:00</span>
                    )}
                  </div>
                )}
              </FormControl>
            </FormItem>

            {isEditing ? (
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    form.setValue('dueDate', '')
                    form.setValue('dueTime', '')
                    timeTouchedRef.current = false
                  }}
                >
                  Clear
                </Button>
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Priority */}
          <FormItem>
            <FormLabel className="text-md " htmlFor="priority">
              Priority
            </FormLabel>
            <FormControl>
              <select
                id="priority"
                disabled={!isEditing}
                className={`border-input h-9 w-full rounded-md border px-3 py-1 text-sm outline-none disabled:opacity-60 ${
                  isEditing ? 'bg-transparent' : 'bg-secondary-background/50 border-none'
                }`}
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

          {/* Est Pomodoros + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormItem>
              <FormLabel className="text-md" htmlFor="estimatedPomodoros">
                Est. Pomodoros
              </FormLabel>
              <FormControl>
                <Input
                  id="estimatedPomodoros"
                  type="number"
                  min={0}
                  step={1}
                  disabled={!isEditing}
                  className={`disabled:opacity-60 ${
                    isEditing ? 'bg-transparent' : 'bg-secondary-background/50 border-none'
                  }`}
                  {...form.register('estimatedPomodoros', {
                    setValueAs: (v) => (v === '' || v === null ? null : Number(v))
                  })}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.estimatedPomodoros?.toString()}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel className="text-md" htmlFor="tags">
                Tags (comma-separated)
              </FormLabel>
              <FormControl>
                <Input
                  id="tags"
                  placeholder="work, urgent"
                  disabled={!isEditing}
                  className={`disabled:opacity-60 ${
                    isEditing ? 'bg-transparent' : 'bg-secondary-background/50 border-none'
                  }`}
                  {...form.register('tags')}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.tags?.toString()}</FormMessage>
            </FormItem>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isEditing) handleCancelEdit()
                else close()
              }}
              disabled={updateTaskMutation.isPending}
            >
              {isEditing ? 'Cancel' : 'Close'}
            </Button>

            {isEditing && (
              <Button
                type="button"
                onClick={() => {
                  form.handleSubmit(onSubmit)()
                }}
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            )}
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
