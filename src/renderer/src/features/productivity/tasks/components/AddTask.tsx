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
import {Button } from '@/components/ui/button'
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().optional(),
  estimatedPomodoros: z.number().nullable().optional()
})

type AddTaskFormInput = z.infer<typeof schema>

export const AddTask = () => {
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
    formState: { errors, isSubmitting }
  } = useForm<AddTaskFormInput>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: AddTaskFormInput) => {
    const rawTags = (data.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const taskToSave: Partial<Task> = {
      title: data.title,
      description: data.description,
      priority: data.priority ?? null,
      tags: rawTags,
      isComplete: false,
      estimatedPomodoros: data.estimatedPomodoros ?? null
    }

    mutation.mutate(taskToSave, {
      onSuccess: () => {
        reset()
      },
      onError: (error) => {
        console.error('Task creation failed:', error)
      }
    })
  }

  return (
    <Card className="border-none">
      <CardHeader>Add New Task</CardHeader>
      <CardContent>
        <Form>
          <FormItem>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl>
              <Input id="title" placeholder="Task title" {...register('title')} />
              <FormMessage>{errors.title?.message}</FormMessage>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl>
              <Input
                id="description"
                placeholder="Optional description"
                {...register('description')}
              />
            </FormControl>
          </FormItem>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormItem>
              <FormLabel htmlFor="priority">Priority</FormLabel>
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
              <FormLabel htmlFor="estimatedPomodoros">Estimated Pomodoros</FormLabel>
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

          <FormItem>
            <FormLabel htmlFor="tags">Tags (comma separated)</FormLabel>
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
