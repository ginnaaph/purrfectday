import { useCallback, useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Controller, type Control } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/libs/QueryClient'
import { getAllProjects } from '@/features/productivity/projects/api/getAllProjects.api'
import { insertProject } from '@/features/productivity/projects/api/insertProject.api'
import { cn } from '@/libs/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/command/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Project } from '@/features/productivity/tasks/types'

type FieldValue = { label: string; value: number } | null

type ProjectComboBoxProps = {
  control: Control<any>
  name: string
  disabled?: boolean
}

export const ProjectComboBox = ({ control, name, disabled = false }: ProjectComboBoxProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
    staleTime: 1000 * 60 * 5
  })

  const { mutateAsync: createProject, isPending: isCreating } = useMutation({
    mutationFn: (name: string) => insertProject(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const items: Project[] = useMemo(() => projects ?? [], [projects])

  const onEnterCreateIfNeeded = useCallback(
    async (currentInput: string, onChange: (value: FieldValue) => void) => {
      const trimmed = currentInput.trim()
      if (!trimmed) return

      const existing = items.find((p) => p.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase())

      if (existing) {
        onChange({ label: existing.name, value: existing.id })
        setOpen(false)
        return
      }

      const created = await createProject(trimmed)
      if (created) {
        onChange({ label: created.name, value: created.id })
        setOpen(false)
        setInputValue('')
      }
    },
    [items, createProject]
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selected = items.find((p) => p.id === field.value?.value)

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-50 justify-between"
                disabled={disabled || isCreating || isLoadingProjects}
              >
                {selected ? selected.name : 'Select project...'}
                {isCreating ? (
                  <Loader2 className="ml-2 size-4 animate-spin opacity-70" />
                ) : (
                  <ChevronsUpDown className="opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0">
              <Command>
                <CommandInput
                  placeholder="Search or create project..."
                  className="h-9"
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      await onEnterCreateIfNeeded(inputValue, field.onChange)
                    }
                  }}
                  disabled={disabled || isCreating}
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoadingProjects ? 'Loading projects...' : 'No projects found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    {items.map((project) => (
                      <CommandItem
                        key={project.id}
                        onSelect={() => {
                          field.onChange({ label: project.name, value: project.id })
                          setOpen(false)
                        }}
                        disabled={disabled || isCreating}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value?.value === project.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {project.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
}
