import { getGreeting } from '@/utils/getGreeting'
import { getFormattedDate } from '@/utils/dates/getFormattedDate'

export const Header = () => {
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <div>
      <div className="text-heading">{greeting}</div>
      <p className="text-subheading">{formattedDate}</p>
    </div>
  )
}
