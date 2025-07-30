import React from 'react'
import clsx from 'clsx'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  const variantClasses = {
    primary: [
      'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
      'text-white border border-transparent'
    ],
    secondary: [
      'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
      'text-white border border-transparent'
    ],
    outline: [
      'bg-white hover:bg-gray-50 focus:ring-primary-500',
      'text-gray-700 border border-gray-300'
    ],
    ghost: [
      'bg-transparent hover:bg-gray-100 focus:ring-primary-500',
      'text-gray-700 border border-transparent'
    ],
    danger: [
      'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      'text-white border border-transparent'
    ]
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-4 py-2 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12'
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? 'gray' : 'white'} 
          className="mr-2" 
        />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {children}
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  )
}