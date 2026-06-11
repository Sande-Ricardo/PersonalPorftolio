"use client"

import * as React from "react"

export interface BootSequenceProps {
  onComplete: () => void
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = React.useState<string[]>([])
  const [currentLine, setCurrentLine] = React.useState(0)
  const [isBlinking, setIsBlinking] = React.useState(true)

  const bootLogs = [
    "&gt; SANDE_RICARDO OS [Version 2.4.0]",
    "&gt; (c) 2026 SandeRicardo. All rights reserved.",
    "",
    "&gt; INITIALIZING CORE ARCHITECTURE...",
    "&gt; LOADING DESIGN SYSTEM [MONOCHROME_ELEGANCE]...",
    "&gt; CONNECTING SECURE CLIENT DATABASE [FIREBASE_ACTIVE]...",
    "&gt; MOUNTING INDEPENDENT PORTFOLIO MODULES...",
    "&gt; TELEMETRY LOGS INJECTED successfully.",
    "&gt; COMPILING STACK_&_SKILLS MATRIX...",
    "&gt; STATUS: ALL SYSTEMS OPERATIONAL",
    "&gt; SYSTEM BOOT READY."
  ]

  React.useEffect(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // Instantly finish boot sequence
      setLogs(bootLogs)
      const timeout = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timeout)
    }

    if (currentLine < bootLogs.length) {
      const interval = setTimeout(
        () => {
          setLogs((prev) => [...prev, bootLogs[currentLine]])
          setCurrentLine((prev) => prev + 1)
        },
        bootLogs[currentLine] === "" ? 150 : 250 // faster break line
      )
      return () => clearTimeout(interval)
    } else {
      // Hold for a moment then call onComplete
      const timeout = setTimeout(() => {
        setIsBlinking(false)
        onComplete()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 select-none">
      {/* Scanning Line overlay */}
      <div className="absolute inset-0 pointer-events-none blueprint-grid opacity-30" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 pointer-events-none animate-[scan_8s_linear_infinite]" />

      <div className="w-full max-w-2xl border border-outline-variant bg-[#141313] p-6 font-mono text-sm leading-relaxed text-primary relative">
        {/* Top bar styling */}
        <div className="flex justify-between items-center border-b border-outline-variant pb-2 mb-4 text-[10px] text-outline tracking-wider uppercase">
          <span>SYSTEM_BOOT_LOG</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Logs terminal */}
        <div className="space-y-1.5 h-[300px] overflow-y-auto custom-scrollbar select-text pr-2">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={log.includes("OPERATIONAL") ? "text-primary font-bold" : "text-on-surface-variant"}
              dangerouslySetInnerHTML={{ __html: log }}
            />
          ))}
          {currentLine < bootLogs.length && (
            <span className={`inline-block w-2 h-4 bg-primary align-middle ${isBlinking ? "animate-[pulse_1s_infinite]" : ""}`} />
          )}
        </div>
      </div>
    </div>
  )
}
