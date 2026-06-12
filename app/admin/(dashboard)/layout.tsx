import * as React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminAuth } from "@/lib/firebase/admin"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get("__session")?.value

  if (!session) {
    redirect("/admin/login")
  }

  let email = "admin@sandericardo.com"

  try {
    // Cryptographically verify session cookie via Firebase Admin SDK
    const decodedClaims = await adminAuth.verifySessionCookie(session, true)
    email = decodedClaims.email || email
  } catch (error) {
    console.error("Session verification failed:", error)
    // Clear cookie and redirect on authentication failure
    redirect("/admin/login")
  }

  return (
    <div className="relative min-h-screen bg-background text-on-background antialiased flex">
      {/* Blueprint background decoration */}
      <div className="fixed inset-0 pointer-events-none blueprint-grid z-0 opacity-40" />

      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main content frame */}
      <div className="flex-grow md:pl-64 flex flex-col min-h-screen relative z-10">
        <AdminHeader email={email} />
        <main className="flex-grow p-6 md:p-8 w-full max-w-6xl mx-auto flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  )
}
