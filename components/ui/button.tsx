import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-technical-label text-technical-label uppercase tracking-widest transition-all duration-300 rounded-none border outline-none disabled:opacity-50 disabled:pointer-events-none active:opacity-80"

    const variants = {
      primary: "bg-white text-black border-white hover:bg-transparent hover:text-white",
      secondary: "bg-transparent text-white border-outline hover:border-white",
      outline: "bg-transparent text-white border-outline-variant hover:border-outline",
      ghost: "bg-transparent text-white border-transparent hover:bg-white/5",
    }

    const sizes = {
      default: "px-8 py-4",
      sm: "px-4 py-2 text-xs",
      lg: "px-10 py-5 text-base",
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
