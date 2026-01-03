import { useTaskStore } from '@/features/productivity/tasks/store/useTaskStore'
import { Card, CardContent, CardAction } from '@/components/card/ui/card'
import { Button } from '@/components/ui/button'
type CoinModalProps = {
  isVisible: boolean
  onClose: () => void
  coinEarned: number
  coinImgSrc: string
}

export const CoinModal = ({ isVisible, onClose, coinEarned, coinImgSrc }: CoinModalProps) => {
  // Read UI-only coin feedback from task UI store
  const earnedCoins = useTaskStore((s) => s.lastCoinsEarned)
  if (!isVisible) return null

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <img src={coinImgSrc} alt="Coin" className="w-20 h-20 mb-4 animate-bounce" />
        <p className="text-xl font-semibold mb-2">You earned {earnedCoins} coins! 🎉</p>
        <img src={coinImgSrc} alt="coin" className="w-24 h-24 mx-auto mb-4" />{' '}
        {coinEarned > 1 ? '' : ''}
        <CardAction>
          <Button variant="default" onClick={onClose}>
            Claim and Close
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  )
}
