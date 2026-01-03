export interface JournalEntry {
  id: number
  title: string | null
  content: string
  entry_date: Date | null
  category: string | null
  mood: string | null
  image: string | null
  tags?: string[]
  files: JournalAttachment[] | null
}

export interface JournalPrompt {
  id: number
  category: string | null
  title: string
  body: string
  questions: string[]
  tags: string[]
  isFavorite?: boolean
}

export interface JournalAttachment {
  entryId: number
  imageUrl?: string
  quote?: string
  sticker?: string
}

export interface Streak {
  current: number
  longest: number
  lastDate: Date | null
}

export type Moods = '🙂' | '😐' | '🙁'

export interface MoodEntry {
  id: string // uuid
  mood: Moods
  energy: 'low' | 'med' | 'high'
  stress: 'low' | 'med' | 'high'
  note?: string
  captured_at: string // ISO timestamp
  session_anchor: 'pre_focus' | 'post_focus' | 'manual'
}
