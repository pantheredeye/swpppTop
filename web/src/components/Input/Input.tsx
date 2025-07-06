import React, { forwardRef } from 'react'

import { TextField } from '@cedarjs/forms'

interface InputProps {
  label: string
  name: string
  className?: string
  validation?: Record<string, unknown>
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, className = '', validation, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          {label}
        </label>
        <TextField
          id={name}
          name={name}
          className={`focus:shadow-outline w-full appearance-none rounded-sm border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${className}`}
          ref={ref}
          validation={validation}
          {...props}
        />
      </div>
    )
  }
)

export default Input
