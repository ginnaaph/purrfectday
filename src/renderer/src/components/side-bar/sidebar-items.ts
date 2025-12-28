import Home from '@/assets/images/icons/home.png'
import Backpack from '@/assets/images/icons/backpack.png'
import Graph from '@/assets/images/icons/graph.png'
import Folder from '@/assets/images/icons/folder.png'
import Settings from '@/assets/images/icons/setting.png'
import FountainPen from '@/assets/images/icons/fountainPen.png'
import Goals from '@/assets/images/icons/goals.png'
import Tomato from '@/assets/images/icons/tomato.png'
import Tasks from '@/assets/images/icons/tasks.png'

interface SidebarItem {
  title: string
  url: string
  icon: string
}

export const items: SidebarItem[] = [
  {
    title: 'Today',
    url: '/',
    icon: Home
  },
  {
    title: 'Overview',
    url: '/overview',
    icon: Graph
  },

  {
    title: 'Inventory',
    url: '/inventory',
    icon: Backpack
  }
]
export const ProductivityItems: SidebarItem[] = [
  { title: 'Projects', url: '/projects', icon: Folder },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: Tasks
  },
  {
    title: 'Pomodoro',
    url: '/pomodoro',
    icon: Tomato
  },
    {
    title: 'Goals',
    url: '/goals',
    icon: Goals
  }
]

export const RechargeItems: SidebarItem[] = [
  {
    title: 'Journal',
    url: '/journal',
    icon: FountainPen
  },

]
