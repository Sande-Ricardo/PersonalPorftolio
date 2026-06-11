import * as React from "react"

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "outline" | "active"
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className = "", variant = "outline", children, ...props }, ref) => {
    const baseStyles =
      "inline-block font-technical-label text-technical-label uppercase rounded-none px-2 py-1 tracking-wider text-xs transition-colors duration-200"

    const variants = {
      outline: "bg-transparent text-on-surface-variant border border-outline-variant hover:border-outline hover:text-white",
      active: "bg-white text-black border border-white font-bold",
    }

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Tag.displayName = "Tag"
