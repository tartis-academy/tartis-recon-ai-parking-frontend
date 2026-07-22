import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  icon?: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, icon, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-surface-app border rounded-lg py-2.5 text-white focus:outline-none transition-colors appearance-none
            ${icon ? 'pl-10 pr-10' : 'px-4'}
            ${error 
              ? 'border-state-error focus:border-state-error' 
              : 'border-border-default focus:border-brand-500'
            }
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {/* Custom Caret */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && <p className="mt-1 text-xs text-state-error">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
