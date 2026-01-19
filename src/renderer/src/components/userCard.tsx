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
    <Item className="w-fit mt-3 mb-3 p-1 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
      <ItemMedia>
        <img src={CatHead} alt="Cat Head" className="h-12 w-12 rounded-full" />
      </ItemMedia>

      <ItemContent className="group-data-[collapsible=icon]:hidden">
        <ItemTitle className="text-lg font-semibold">Gi Gi</ItemTitle>
        <ItemActions>
          <Button  size="sm" className="mt-2">
            View Profile
          </Button>
        </ItemActions>
      </ItemContent>
    </Item>
  )
}
