// Note: keep this utility independent of external types to avoid resolution issues.

let __eventCounter = 0
const nextId = () => {
  __eventCounter += 1
  return __eventCounter
}

export function buildEvent(args: {
  phase: 'focus' | 'break'
  startedAt: Date
  endedAt?: Date // defaults to now if omitted
  completed: boolean
  taskId?: number | null
}) {
  const endedAt = args.endedAt ?? new Date()
  const startedAt = args.startedAt
  const rawMs = endedAt.getTime() - startedAt.getTime()
  const durationSec = Math.max(0, Math.floor(rawMs / 1000))

  const event = {
    id: nextId(),
    phase: args.phase,
    startedAt,
    endedAt,
    durationSec,
    completed: args.completed,
    taskId: args.taskId ?? null
  }

  return event
}
