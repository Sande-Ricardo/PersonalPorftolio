import * as React from "react"
import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-background text-on-background px-margin-mobile md:px-margin-desktop antialiased overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none blueprint-grid z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full flex justify-center items-center py-12">
        <LoginForm />
      </div>

      {/* System Footer Stamp */}
      <div className="absolute bottom-6 font-technical-label text-[10px] text-outline uppercase tracking-wider">
        SYS.SECURE_ZONE // ALL_ACTIONS_LOGGED
      </div>
    </div>
  )
}
