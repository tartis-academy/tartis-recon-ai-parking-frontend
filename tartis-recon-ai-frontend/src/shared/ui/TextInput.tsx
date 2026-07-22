import { forwardRef, type InputHTMLAttributes } from 'react'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-surface-app border rounded-lg py-2.5 text-white placeholder-gray-600 focus:outline-none transition-colors
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${error 
              ? 'border-state-error focus:border-state-error' 
              : 'border-border-default focus:border-brand-500'
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-state-error">{error}</p>}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
