import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { createTask } from '@/features/productivity/tasks/api/createTask'
import type { Task } from '@/features/productivity/tasks/types'
import { Card, CardHeader, CardContent } from '@/components/card/ui/card'

import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/side-bar/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Label } from '@/components/label/ui/label'
import { ChevronDownIcon } from 'lucide-react'
import { ProjectComboBox } from '@/features/productivity/projects/components/ProjectComboBox'
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['task', 'habit']).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().optional(),
  estimatedPomodoros: z.number().nullable().optional(),
  project: z
    .object({
      label: z.string(),
      value: z.number()
    })
    .nullable()
    .optional()
})

type AddTaskFormInput = z.infer<typeof schema>

export const AddTask = () => {
  const [dateOpen, setDateOpen] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [dueTime, setDueTime] = useState<string>('')
  const mutation = useMutation({
    mutationFn: (task: Partial<Task>) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<AddTaskFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: null
    }
  })

  const onSubmit = async (data: AddTaskFormInput) => {
    const rawTags = (data.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    // combine date + time
    let combinedDue: Date | null = null
    if (dueDate) {
      const d = new Date(dueDate)
      if (dueTime) {
        const [h, m = '0', s = '0'] = dueTime.split(':')
        d.setHours(Number(h || 0), Number(m || 0), Number(s || 0), 0)
        combinedDue = d
      } else {
        d.setHours(0, 0, 0, 0)
        combinedDue = d
      }
    }

    const taskToSave: Partial<Task> = {
      title: data.title,
      type: data.type ?? 'task',
      description: data.description,
      priority: data.priority ?? null,
      tags: rawTags,
      isComplete: false,
      estimatedPomodoros: data.estimatedPomodoros ?? null,
      project_id: data.project?.value ?? null,
      dueDate: combinedDue
    }

    mutation.mutate(taskToSave, {
      onSuccess: () => {
        reset()
        setDueDate(undefined)
        setDueTime('')
      },
      onError: (error) => {
        console.error('Task creation failed:', error)
      }
    })
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="font-bold text-xl text-primary-alt">Add New Task</CardHeader>
      <CardContent className="gap-3">
        <Form className="gap-4 flex flex-col">
          <FormItem>
            <FormLabel className="text-md pb-2" htmlFor="title">
              Title
            </FormLabel>
            <FormControl>
              <Input id="title" placeholder="Task title" {...register('title')} />
              <FormMessage>{errors.title?.message}</FormMessage>
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel className="text-md pb-2" htmlFor="type">
              Type
            </FormLabel>
            <FormControl>
              <select
                id="type"
                className="h-9 rounded-md border px-3 text-sm"
                {...register('type')}
              >
                <option value="task">Task</option>
                <option value="habit">Habit</option>
              </select>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel className="text-md pb-2" htmlFor="description">
              Description
            </FormLabel>
            <FormControl>
              <Input
                id="description"
                placeholder="Optional description"
                {...register('description')}
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel className="text-md pb-2" htmlFor="project">
              Project
            </FormLabel>
            <FormControl>
              <ProjectComboBox control={control} name="project" />
            </FormControl>
          </FormItem>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormItem>
              <FormLabel className="text-md pb-2" htmlFor="priority">
                Priority
              </FormLabel>
              <FormControl>
                <select
                  id="priority"
                  className="h-9 rounded-md border px-3 text-sm"
                  {...register('priority')}
                >
                  <option value="">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel className="text-md pb-2" htmlFor="estimatedPomodoros">
                Estimated Pomodoros
              </FormLabel>
              <FormControl>
                <Input
                  id="estimatedPomodoros"
                  type="number"
                  {...register('estimatedPomodoros', {
                    setValueAs: (v) => (v === '' || v == null ? null : Number(v))
                  })}
                />
              </FormControl>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <Label htmlFor="date-picker" className="px-1 text-md ">
                Date
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    className="w-40 justify-between  border bg-transparent border-primary text-primary"
                  >
                    {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select date'}
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate ? new Date(dueDate) : undefined}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      setDueDate(d)
                      setDateOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="time-picker" className="px-1 text-md ">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          <FormItem>
            <FormLabel className="text-md pb-2" htmlFor="tags">
              Tags (comma separated)
            </FormLabel>
            <FormControl>
              <Input id="tags" placeholder="e.g. work,urgent,deep focus" {...register('tags')} />
            </FormControl>
          </FormItem>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
              Clear
            </Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
