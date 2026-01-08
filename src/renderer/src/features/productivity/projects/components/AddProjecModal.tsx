import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type AddProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string) => void
}

export const AddProjectModal = ({ isOpen, onClose, onAdd }: AddProjectModalProps) => {
  const [projectName, setProjectName] = useState('')
  const handleSubmit = () => {
    const trimmedName = projectName.trim()
    if (trimmedName) {
      onAdd(trimmedName)
      setProjectName('')
      onClose()
    }
  }
  if (!isOpen) return null
  return (
    <Card className="z-50"> 
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Project</Button>
        </div>
      </CardContent>
    </Card>
  )
}
