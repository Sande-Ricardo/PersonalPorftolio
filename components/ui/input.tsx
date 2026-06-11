import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`w-full bg-transparent text-white border border-outline-variant focus:border-white px-4 py-3 font-technical-label text-technical-label rounded-none outline-none transition-colors duration-200 placeholder:text-outline/60 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
