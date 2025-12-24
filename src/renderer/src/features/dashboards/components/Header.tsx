import { getGreeting } from '@/utils/getGreeting'
import { getFormattedDate } from '@/utils/dates/getFormattedDate'

export const Header = () => {
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <header>
      <h1>{greeting}</h1>
      <p>{formattedDate}</p>
    </header>
  )
}
