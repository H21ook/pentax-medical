import * as React from 'react'
import { cn } from '../../lib/utils'

const Textarea = React.forwardRef(
  ({ className, disabled = false, readonly = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[60px] w-full rounded-md border border-input bg-body px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed ${readonly ? 'disabled:opacity-100' : 'disabled:opacity-50'}`,
          className
        )}
        disabled={readonly || disabled}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
