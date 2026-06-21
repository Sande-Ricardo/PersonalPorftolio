"use client"

import * as React from "react"
import Image from "next/image"

import { AboutContent } from "@/lib/db/content"

export interface AboutProps {
  data?: AboutContent | null
}

export const About: React.FC<AboutProps> = ({ data }) => {
  const bioParagraphs = data?.bio_paragraphs?.length
    ? data.bio_paragraphs
    : [
      "I design and build scalable software solutions at the intersection of raw performance and minimal technical aesthetics. I treat code as infrastructure: structurally sound, meticulously documented, and fundamentally deterministic.",
      "Specialized in distributed systems and high-availability cloud ecosystems, I focus on dismantling complex problems into modular logical components that tolerate faults and degrade gracefully under stress.",
      "Currently researching the operational integration of machine learning models and RAG (Retrieval-Augmented Generation) systems to automate data analysis and enterprise workflows."
    ]

  const highlights = data?.highlights?.length
    ? data.highlights
    : [
      { label: "YEARS EXP", value: "5+" },
      { label: "PROJECTS", value: "15+" },
      { label: "LOCATION", value: "BUENOS AIRES (UTC-3)" }
    ]

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      <div className="mb-12">
        <span className="font-technical-label text-technical-label text-on-surface-variant block mb-2">
          [ 02 ] ABOUT_ME
        </span>
        <h2 className="font-display text-[24px] font-medium text-primary uppercase">
          SYSTEM.PROFILE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-px md:bg-outline-variant border border-outline-variant">
        {/* Left Side (Photo Container) */}
        <div className="md:col-span-5 bg-background h-full min-h-[400px] relative grayscale contrast-125 p-4 flex items-center justify-center">
          <div className="relative w-full h-full min-h-[360px] border border-outline-variant p-2 bg-background flex items-center justify-center grayscale">
            <Image
              src={data?.avatar_url || "/profile_avatar.png"}
              alt={data?.avatar_alt || "Ricardo Sande"}
              fill
              className="object-cover p-2"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          {/* Decorative Brutalist corner markers */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" />
        </div>

        {/* Right Side (Biographical Text & Stats) */}
        <div className="md:col-span-7 bg-background p-8 flex flex-col justify-between">
          <div className="space-y-6 font-body-base text-body-base leading-relaxed text-on-surface">
            {bioParagraphs.map((para, idx) => (
              <p key={idx} className="whitespace-pre-line">{para}</p>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-outline-variant flex flex-wrap gap-6 font-technical-label text-technical-label text-on-surface-variant">
            {highlights.map((hl, idx) => (
              <div key={idx}>
                <span className="text-primary mr-1">&gt;</span> {hl.value} {hl.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
