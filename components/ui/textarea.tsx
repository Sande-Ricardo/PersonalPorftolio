import * as React from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        className={`w-full bg-transparent text-white border border-outline-variant focus:border-white px-4 py-3 font-technical-label text-technical-label rounded-none outline-none transition-colors duration-200 placeholder:text-outline/60 min-h-[120px] resize-y ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"
