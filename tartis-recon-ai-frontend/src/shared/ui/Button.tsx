import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  children: ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-brand-500 text-black hover:bg-brand-400 shadow-[0_0_15px_var(--color-brand-glow)]',
    secondary: 'bg-surface-panel text-white border border-border-default hover:bg-surface-row-hover',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-surface-panel',
    danger: 'bg-state-error/10 text-state-error border border-state-error/30 hover:bg-state-error/20',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
