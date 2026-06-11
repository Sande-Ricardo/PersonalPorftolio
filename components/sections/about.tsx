"use client"

import * as React from "react"
import Image from "next/image"

export const About: React.FC = () => {
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
          <div className="relative w-full h-full min-h-[360px] border border-outline-variant p-2 bg-background flex items-center justify-center">
            <Image
              src="/profile_avatar.png"
              alt="Ricardo Sande"
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
            <p>
              Diseño y construyo soluciones de software escalables en la intersección de
              rendimiento crudo y estética técnica minimalista. Trato el código como infraestructura:
              estructuralmente sólido, meticulosamente documentado y fundamentalmente determinista.
            </p>
            <p>
              Especializado en sistemas distribuidos y desarrollo de ecosistemas en la nube de alta
              disponibilidad, me enfoco en desarmar problemas complejos en componentes lógicos modulares
              que toleren fallos y degraden de manera controlada bajo estrés.
            </p>
            <p>
              Actualmente investigo sobre la integración operativa de modelos de inteligencia artificial y
              sistemas RAG (Retrieval-Augmented Generation) para automatizar análisis de datos y flujos de
              trabajo empresariales.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-outline-variant flex flex-wrap gap-6 font-technical-label text-technical-label text-on-surface-variant">
            <div>
              <span className="text-primary mr-1">&gt;</span> 5+ AÑOS EXP
            </div>
            <div>
              <span className="text-primary mr-1">&gt;</span> 15+ PROYECTOS
            </div>
            <div>
              <span className="text-primary mr-1">&gt;</span> BUENOS AIRES (UTC-3)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
