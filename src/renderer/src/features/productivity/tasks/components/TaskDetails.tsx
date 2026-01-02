import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTaskDetailData } from '../hooks/useTaskDetailData'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/text-area/ui/textArea'
import { Button } from '@/components/ui/button'
import { useTaskModalStore } from '../store/useTaskModalStore'
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
  dueDate: z.string().optional()
})
type TaskDetailsFormInput = z.infer<typeof schema>

export const TaskDetails = ({ taskId }: { taskId: number | null }) => {
  const isOpen = useTaskModalStore((s) => s.isOpen)
  const selectedTaskId = useTaskModalStore((s) => s.selectedTaskId)
  const close = useTaskModalStore((s) => s.close)
  const { task, updateTaskMutation } = useTaskDetailData(taskId)

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
  }, [task, form])

  function onSubmit(values: TaskDetailsFormInput) {
    if (!selectedTaskId) return

    const updates = {
      title: values.title,
      description: values.description ?? undefined,
      priority: values.priority ?? null,
      tags: values.tags ?? '',
      estimated_pomodoros:
        typeof values.estimatedPomodoros === 'number' ? values.estimatedPomodoros : null,
      dueDate: values.dueDate ? new Date(values.dueDate) : null
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
              <FormLabel htmlFor="dueDate">Due Date</FormLabel>
              <FormControl>
                <Input id="dueDate" type="date" {...form.register('dueDate')} />
              </FormControl>
              <FormMessage>{form.formState.errors.dueDate?.toString()}</FormMessage>
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
