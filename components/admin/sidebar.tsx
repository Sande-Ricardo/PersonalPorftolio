"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"

interface SidebarItem {
  name: string
  href: string
  label: string
}

const NAV_ITEMS: SidebarItem[] = [
  { name: "DASHBOARD", href: "/admin", label: "01 // OVERVIEW" },
  { name: "CONTENT", href: "/admin/content", label: "02 // GLOBAL_TEXT" },
  { name: "PROJECTS", href: "/admin/projects", label: "03 // PORTFOLIO" },
  { name: "IMAGES", href: "/admin/images", label: "04 // MEDIA" },
  { name: "MESSAGES", href: "/admin/messages", label: "05 // INBOX" },
]

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogout = async () => {
    if (confirm("Execute system logout?")) {
      const res = await logoutAction()
      if (res.success) {
        window.location.href = "/admin/login"
      }
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-white text-black p-4 border border-black font-technical-label text-xs uppercase tracking-widest cursor-pointer shadow-lg hover:opacity-90 active:scale-95 transition-transform"
      >
        {isOpen ? "[ CLOSE_MENU ]" : "[ OPEN_MENU ]"}
      </button>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#191A1E] border-r border-outline-variant flex flex-col justify-between p-6 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* System Brand */}
          <div className="border-b border-outline-variant pb-6">
            <span className="font-technical-label text-[10px] text-outline block mb-1">
              CMS_CONTROL_UNIT
            </span>
            <Link href="/admin" className="font-display text-lg font-bold text-primary tracking-tighter block uppercase">
              SANDE.ADMIN
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex flex-col p-3 border transition-all duration-200 group rounded-none ${
                    isActive
                      ? "bg-white border-white text-black"
                      : "bg-transparent border-transparent text-on-surface-variant hover:border-outline-variant hover:text-white"
                  }`}
                >
                  <span className={`font-technical-label text-[9px] block mb-1 ${isActive ? "text-black/60" : "text-outline group-hover:text-white/60"}`}>
                    {item.label}
                  </span>
                  <span className="font-technical-label text-xs font-bold uppercase tracking-wider">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="border-t border-outline-variant pt-6 flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="w-full text-left font-technical-label text-xs text-error hover:underline uppercase tracking-widest cursor-pointer"
          >
            [ EXECUTE_LOGOUT ]
          </button>
          <div className="font-technical-label text-[9px] text-outline">
            STAMP: {new Date().getFullYear()} // SECURE_SESSION
          </div>
        </div>
      </aside>
    </>
  )
}
