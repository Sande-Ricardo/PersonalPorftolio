"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { TerminalIcon, ArrowForwardIcon, ArrowDownwardIcon } from "../ui/icons"

export interface HeroProps {
  onScrollToProjects?: () => void
}

export const Hero: React.FC<HeroProps> = ({ onScrollToProjects }) => {
  const [latency, setLatency] = React.useState("12ms")

  React.useEffect(() => {
    // Generate slight random variation for latency to feel alive, but keep it low
    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 5) + 8
      setLatency(`${ms}ms`)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-20 z-10 select-none">
      <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter w-full">
        <div className="col-span-4 md:col-span-10 xl:col-span-8 flex flex-col items-start space-y-8">
          {/* Boot sequence reference text */}
          <div className="font-technical-label text-technical-label text-outline flex items-center gap-2 uppercase">
            <TerminalIcon size={14} className="text-outline" />
            <span>&gt; SYSTEM_READY // sande_ricardo.exe</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-[32px] md:text-[48px] font-semibold leading-none text-primary tracking-tighter uppercase">
            Ricardo Sande
          </h1>

          {/* Tagline section with vertical brutalist line */}
          <div className="border-l border-outline-variant pl-4 py-1 flex flex-col gap-4">
            <div className="font-technical-label text-body-base text-primary uppercase tracking-widest font-semibold">
              Fullstack &amp; AI Engineer
            </div>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl leading-relaxed">
              I design systems that think, interfaces that respond, and architectures that scale.
              Specialized in high-performance ecosystems and technical minimalism.
            </p>
          </div>

          {/* Technical Telemetry Grid (1px gap, outline border) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant w-full max-w-2xl mt-4 border border-outline-variant">
            <div className="bg-background p-4 flex flex-col gap-1">
              <span className="font-technical-label text-[10px] text-outline uppercase">STATUS</span>
              <span className="font-code-snippet text-code-snippet text-primary font-bold">ONLINE</span>
            </div>
            <div className="bg-background p-4 flex flex-col gap-1">
              <span className="font-technical-label text-[10px] text-outline uppercase">LOC</span>
              <span className="font-code-snippet text-code-snippet text-primary font-bold">BUENOS AIRES</span>
            </div>
            <div className="bg-background p-4 flex flex-col gap-1">
              <span className="font-technical-label text-[10px] text-outline uppercase">LATENCY</span>
              <span className="font-code-snippet text-code-snippet text-primary font-bold">{latency}</span>
            </div>
            <div className="bg-background p-4 flex flex-col gap-1">
              <span className="font-technical-label text-[10px] text-outline uppercase">UPTIME</span>
              <span className="font-code-snippet text-code-snippet text-primary font-bold">99.98%</span>
            </div>
          </div>

          {/* Call to Actions (CTAs) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={onScrollToProjects}
              className="flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              View projects
              <ArrowForwardIcon
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Button>
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Download CV
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-technical-label text-[10px] text-outline lowercase tracking-widest">
          scroll_down()
        </span>
        <ArrowDownwardIcon size={14} className="text-outline" />
      </div>
    </section>
  )
}
