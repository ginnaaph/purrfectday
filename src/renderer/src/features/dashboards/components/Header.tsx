import { getGreeting } from '@/utils/getGreeting'
import { getFormattedDate } from '@/utils/dates/getFormattedDate'

export const Header = () => {
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
  <div>
      <h1 className="text-heading">{greeting}</h1>
      <p className="text-subheading">{formattedDate}</p>
  </div>
  )
}
