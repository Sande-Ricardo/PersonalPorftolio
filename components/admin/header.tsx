"use client"

import * as React from "react"
import Link from "next/link"

interface AdminHeaderProps {
  email?: string
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ email = "admin@sandericardo.com" }) => {
  return (
    <header className="h-16 border-b border-outline-variant bg-[#191A1E]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-4">
        {/* Connection status dot */}
        <div className="flex items-center gap-2 font-technical-label text-[10px] text-primary">
          <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
          SYSTEM_ONLINE
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* User Identity Info */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-technical-label text-[9px] text-outline uppercase">OPERATOR</span>
          <span className="font-technical-label text-xs text-primary">{email}</span>
        </div>

        {/* Public view shortcut button */}
        <Link
          href="/"
          target="_blank"
          className="border border-outline-variant hover:border-white px-4 py-2 font-technical-label text-[10px] text-primary uppercase tracking-wider transition-colors duration-200"
        >
          [ PUBLIC_SITE ]
        </Link>
      </div>
    </header>
  )
}
