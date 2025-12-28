import Home from '@/assets/images/icons/home.png'
import Backpack from '@/assets/images/icons/backpack.png'
import Graph from '@/assets/images/icons/graph.png'
import Folder from '@/assets/images/icons/folder.png'
import Settings from '@/assets/images/icons/setting.png'
import FountainPen from '@/assets/images/icons/fountainPen.png'
import Goals from '@/assets/images/icons/goals.png'

interface SidebarItem {
  title: string
  url: string
  icon: string
}

export const items: SidebarItem[] = [
  {
    title: 'Today',
    url: '/today',
    icon: Home
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Folder
  },
  {
    title: 'Journal',
    url: '/journal',
    icon: FountainPen
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Backpack
  },
  {
    title: 'Overview',
    url: '/overview',
    icon: Graph
  },
  {
    title: 'Goals',
    url: '/goals',
    icon: Goals
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings
  }
]
