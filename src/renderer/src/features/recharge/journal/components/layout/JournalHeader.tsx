import Quotes from '../Quotes'
import { Card, CardContent } from '@/components/card/ui/card'

export const JournalHeader = () => {
  return (
    <Card className="bg-background-secondary ">
      <CardContent className="flex flex-col gap-2 text-center">
        <h1 className="text-heading tracking-wider text-primary-alt">Journal</h1>
        <div className="text-sm text-primary-alt/70">Reflect, reset, and write it out.</div>
        <Quotes />
      </CardContent>
    </Card>
  )
}
