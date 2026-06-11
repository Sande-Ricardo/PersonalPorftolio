"use client"

import * as React from "react"

export interface CopyButtonProps {
  text: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="font-technical-label text-[10px] text-primary hover:underline cursor-pointer outline-none"
    >
      {copied ? "[ COPIED! ]" : "[ COPY ]"}
    </button>
  )
}
