import * as React from 'react'
import { Label } from '@radix-ui/react-label'
import { cn } from '@/libs/utils'

// Minimal shadcn-style form primitives for React Hook Form
export function Form({ children, className }: { children: React.ReactNode; className?: string }) {
  return <form className={cn('space-y-4', className)}>{children}</form>
}

export function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

export function FormLabel({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <Label htmlFor={htmlFor} className={cn('text-sm font-medium text-foreground', className)}>
      {children}
    </Label>
  )
}

export function FormControl({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-2', className)}>{children}</div>
}

export function FormMessage({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) return null
  return <p className={cn('text-xs text-destructive', className)}>{children}</p>
}

export function FormField({ name, children }: { name: string; children: React.ReactNode }) {
  // This is a presentational wrapper; logic is handled in the parent using RHF's Controller/register.
  return <div data-form-field={name}>{children}</div>
}
