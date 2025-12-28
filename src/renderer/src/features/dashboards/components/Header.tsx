import { getGreeting } from '@/utils/getGreeting'
import { getFormattedDate } from '@/utils/dates/getFormattedDate'

export const Header = () => {
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <div>
      <div className="text-heading p-3">
        {greeting}
        <p className="text-subheading">{formattedDate}</p>
      </div>
    </div>
  )
}
