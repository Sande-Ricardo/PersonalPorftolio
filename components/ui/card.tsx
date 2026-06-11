import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "panel" | "outline"
  withCorners?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", withCorners = false, children, ...props }, ref) => {
    const baseStyles = "relative rounded-none border transition-colors duration-300"

    const variants = {
      default: "bg-background border-outline-variant",
      panel: "bg-surface-container-low border-outline-variant",
      outline: "bg-transparent border-outline-variant",
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {withCorners && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary pointer-events-none" />
          </>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"
