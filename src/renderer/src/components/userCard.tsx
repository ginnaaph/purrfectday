import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemActions
} from '@/components/item/components/ui/item'
import CatHead from '@/assets/images/cat/head.png'

export const UserCard = () => {
  return (
    <Item className="w-full">
      <ItemMedia>
        <img src={CatHead} alt="Cat Head" className="h-20 w-20 rounded-full" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-xl font-semibold">Gi Gi</ItemTitle>
        <ItemActions>
          <Button variant="outline" size="sm" className="mt-2">
            View Profile
          </Button>
        </ItemActions>
      </ItemContent>
    </Item>
  )
}
