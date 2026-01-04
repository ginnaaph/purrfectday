import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-alt text-white shadow hover:bg-primary-alt/60',
        destructive: 'bg-primary text-white shadow-sm hover:bg-primary/90',
        outline:
          'border-1 border-input text-primary-alt border-primary-alt shadow-sm hover:bg-primary-alt/40 hover:text-white',
        secondary: 'bg-cool-accent text-primary shadow-sm hover:bg-cool-accent/80',
        ghost: 'hover:bg-primary-alt text-primary-alt hover:text-primary-alt',
        link: 'text-primary-alt underline-offset-4 hover:underline',
        subtle: 'bg-secondary-background text-primary-alt hover:bg-secondary-background/50'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-6 rounded-md px-2 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
