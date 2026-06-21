"use client"

import * as React from "react"

export interface HeaderProps {
  currentSection?: string
}

export const Header: React.FC<HeaderProps> = ({ currentSection = "about" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navItems = [
    { label: "01 ABOUT", href: "#about", id: "about" },
    { label: "02 PROJECTS", href: "#projects", id: "projects" },
    { label: "03 STACK", href: "#stack", id: "stack" },
    { label: "04 CONTACT", href: "#contact", id: "contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b border-outline-variant flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 rounded-none">
      {/* Brand logo / Monospace title */}
      <a
        href="#"
        className="font-technical-label text-body-base font-bold tracking-tighter text-primary select-none cursor-pointer"
      >
        SANDE_RICARDO
      </a>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = currentSection === item.id
          return (
            <a
              key={item.id}
              href={item.href}
              className={`px-2 py-1 font-technical-label text-technical-label transition-all duration-100 cursor-pointer ${isActive
                  ? "bg-white text-black font-bold"
                  : "text-on-surface-variant hover:bg-white hover:text-black"
                }`}
            >
              {item.label}
            </a>
          )
        })}
      </div>

      {/* Language Toggle & Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        {/* Language selector toggle */}
        {/* <button className="font-technical-label text-technical-label text-primary border border-primary px-3 py-1 cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 uppercase">
          ES/EN
        </button> */}

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden p-1 text-primary cursor-pointer hover:opacity-80 active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          <span className="font-technical-label text-technical-label border border-outline-variant px-2 py-1">
            {mobileMenuOpen ? "CLOSE" : "MENU"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer (brutalist, absolute positioning, no roundness, full-width) */}
      {mobileMenuOpen && (
        <div className="absolute top-[69px] left-0 w-full bg-background border-b border-outline-variant flex flex-col md:hidden z-40">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const isActive = currentSection === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full p-3 font-technical-label text-technical-label text-left transition-all duration-100 ${isActive
                      ? "bg-white text-black font-bold"
                      : "text-on-surface-variant hover:bg-white hover:text-black"
                    }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
