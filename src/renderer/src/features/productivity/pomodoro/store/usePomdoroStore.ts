import { create } from 'zustand'
import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'
import { useCoinsStore } from '@/features/shop/coins/store/useCoinStore'
import { buildEvent } from '@/features/productivity/pomodoro/utils/buildEvent'
import { usePomodoroStatsStore } from '@/features/productivity/pomodoro/store/usePomodoroStats'

type Phase = 'pomodoro' | 'shortBreak' | 'longBreak'

type PomodoroStore = {
  phase: Phase
  isRunning: boolean
  timeLeft: number
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
  pomodoroCount: number
  coinsEarned: number
  showReward: boolean
  showSadCat: boolean
  showSettings: boolean
  currentPhaseStartedAt: Date | null

  start: () => void
  pause: () => void
  reset: () => void

  completePhase: () => void
  endEarly: () => void
  setTimeLeft: (updater: (time: number) => number) => void
  setShowReward: (visible: boolean) => void
  setShowSadCat: (visible: boolean) => void
  setShowSettings: (visible: boolean) => void
  setFocusTime: (updater: (time: number) => number) => void
  setShortBreakTime: (updater: (time: number) => number) => void
  setLongBreakTime: (updater: (time: number) => number) => void
  applyTimerSettings: (settings: { focus: number; short: number; long: number }) => void
}
// Task UI store is used only for UI/session state
// Avoid server-side mutations here; React Query owns task data.
const { addCoins } = useCoinsStore.getState()
const mapPhaseToEventPhase = (phase: Phase): 'focus' | 'break' =>
  phase === 'pomodoro' ? 'focus' : 'break'

function inferStartedAtFromCountdown(opts: {
  endedAt: Date
  phase: Phase
  timeLeft: number
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
}): Date {
  const { endedAt, phase, timeLeft, focusTime, shortBreakTime, longBreakTime } = opts
  const planned =
    phase === 'pomodoro'
      ? focusTime * 60
      : phase === 'shortBreak'
        ? shortBreakTime * 60
        : longBreakTime * 60
  const elapsedSec = Math.max(0, planned - timeLeft)
  return new Date(endedAt.getTime() - elapsedSec * 1000)
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  phase: 'pomodoro',
  isRunning: false,
  timeLeft: 25 * 60,
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  pomodoroCount: 0,
  coinsEarned: 0,
  showReward: false,
  showSadCat: false,
  showSettings: false,
  currentPhaseStartedAt: null,
  setShowReward: (visible) => set({ showReward: visible }),
  setShowSadCat: (visible) => set({ showSadCat: visible }),
  // End Pomodoro early
  endEarly: () => {
    const { phase, focusTime, shortBreakTime, longBreakTime, timeLeft, currentPhaseStartedAt } =
      get()
    const endedAt = new Date()
    const startedAt =
      currentPhaseStartedAt ??
      inferStartedAtFromCountdown({
        endedAt,
        phase,
        timeLeft,
        focusTime,
        shortBreakTime,
        longBreakTime
      })

    usePomodoroStatsStore.getState().addEvent(
      buildEvent({
        phase: mapPhaseToEventPhase(phase),
        startedAt,
        endedAt,
        completed: false
      })
    )
    let newTime = focusTime
    if (phase === 'shortBreak') newTime = shortBreakTime
    if (phase === 'longBreak') newTime = longBreakTime

    set({
      isRunning: false,
      timeLeft: newTime * 60,
      showSadCat: true,
      currentPhaseStartedAt: null // reset
    })
  },
  setShowSettings: (visible) => set({ showSettings: visible }),
  start: () =>
    set((state) => {
      const planned =
        state.phase === 'pomodoro'
          ? state.focusTime * 60
          : state.phase === 'shortBreak'
            ? state.shortBreakTime * 60
            : state.longBreakTime * 60
      const isStartingFresh = state.timeLeft === planned
      return {
        isRunning: true,
        currentPhaseStartedAt: isStartingFresh
          ? new Date()
          : (state.currentPhaseStartedAt ?? new Date())
      }
    }),
  pause: () => set({ isRunning: false }),

  reset: () => {
    const { phase, focusTime, shortBreakTime, longBreakTime } = get()
    const time =
      phase === 'pomodoro' ? focusTime : phase === 'shortBreak' ? shortBreakTime : longBreakTime
    set({ timeLeft: time * 60, isRunning: false, currentPhaseStartedAt: null })
  },

  completePhase: () => {
    const {
      phase,
      pomodoroCount,
      focusTime,
      timeLeft,
      shortBreakTime,
      longBreakTime,
      currentPhaseStartedAt
    } = get()
    const endedAt = new Date()
    const startedAt =
      currentPhaseStartedAt ??
      inferStartedAtFromCountdown({
        endedAt,
        phase,
        timeLeft,
        focusTime,
        shortBreakTime,
        longBreakTime
      })
    usePomodoroStatsStore.getState().addEvent(
      buildEvent({
        phase: mapPhaseToEventPhase(phase),
        startedAt,
        endedAt,
        completed: true
      })
    )
    if (phase === 'pomodoro') {
      const newCount = pomodoroCount + 1
      const earned = newCount % 5 === 0 ? 5 : 1

      const nextPhase = newCount % 5 === 0 ? 'longBreak' : 'shortBreak'
      const nextTime = newCount % 5 === 0 ? longBreakTime * 60 : shortBreakTime * 60

      // Award coins locally and record UI feedback
      addCoins(earned)
      useTaskStore.getState().setLastCoinsEarned(earned)

      set({
        phase: nextPhase,
        timeLeft: nextTime,
        pomodoroCount: newCount,
        coinsEarned: earned,
        showReward: true,
        isRunning: false,
        currentPhaseStartedAt: null
      })
    } else {
      set({
        phase: 'pomodoro',
        timeLeft: focusTime * 60,
        isRunning: false,
        currentPhaseStartedAt: null
      })
    }
  },

  setTimeLeft: (updater) =>
    set((state) => ({
      timeLeft: updater(state.timeLeft)
    })),
  setFocusTime: (updater) =>
    set((state) => ({
      focusTime: updater(state.focusTime)
    })),

  setShortBreakTime: (updater) =>
    set((state) => ({
      shortBreakTime: updater(state.shortBreakTime)
    })),

  setLongBreakTime: (updater) =>
    set((state) => ({
      longBreakTime: updater(state.longBreakTime)
    })),

  applyTimerSettings: (settings) => {
    set((state) => {
      const newFocus = settings.focus
      const newShort = settings.short
      const newLong = settings.long

      let newTimeLeftInSeconds = 0
      if (state.phase === 'pomodoro') {
        newTimeLeftInSeconds = newFocus * 60
      } else if (state.phase === 'shortBreak') {
        newTimeLeftInSeconds = newShort * 60
      } else {
        newTimeLeftInSeconds = newLong * 60
      }
      return {
        ...state,
        isRunning: false,
        focusTime: newFocus,
        shortBreakTime: newShort,
        longBreakTime: newLong,
        timeLeft: newTimeLeftInSeconds
      }
    })
  }
}))
