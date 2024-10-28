import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(
  ({ className, type, disabled = false, readonly = false, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={readonly || disabled}
        className={cn(
          `flex h-9 w-full rounded-md border border-input bg-body px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-body file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed ${readonly ? 'disabled:opacity-100' : 'disabled:opacity-50'}`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
