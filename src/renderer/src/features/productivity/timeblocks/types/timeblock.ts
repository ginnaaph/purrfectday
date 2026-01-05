export interface Timeblock {
  id: number
  taskId?: number
  listId?: number
  tags: string[]
  plannedStart: Date
  plannedEnd: Date
  plannedDuration: number // minutes
  actualStart?: Date
  actualEnd?: Date
  actualDuration?: number
  status: 'planned' | 'active' | 'done' | 'missed' | 'partial'
  notes?: string
  title?: string
  color?: string
  // Link to Availability's client-side id
  clientId?: string
}
