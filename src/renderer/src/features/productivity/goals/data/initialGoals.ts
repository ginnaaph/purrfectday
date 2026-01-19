import type { Goal } from '../types'

export const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Finishing Refactoring Desktop App',
    description: 'Complete redesign of my productivity app using new tech stack',
    deadline: '2026-02-15',
    tasks: [
      { id: '1a', title: 'Finish basic tutorials', isDone: true },
      { id: '1b', title: 'Build a small project', isDone: false }
    ]
  },
  {
    id: 2,
    title: 'Learn System Designs',
    description: 'Read System Design Primer and practice designing systems',
    deadline: null,
    tasks: [
      { id: '2a', title: 'Read chapters 1-5', isDone: true },
      { id: '2b', title: 'Design a URL shortener', isDone: false },
      { id: '2c', title: 'Design a chat application', isDone: false }
    ]
  },
  {
    id: 3,
    title: 'Finish UI design for Purrfect',
    description: 'Complete the user interface design for the Purrfect app',
    deadline: '2026-01-30',
    tasks: [
      { id: '3a', title: 'Create wireframes', isDone: true },
      { id: '3b', title: 'Design high-fidelity mockups', isDone: true }
    ]
  }
]
