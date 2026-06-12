import * as React from "react"
import { adminDb } from "@/lib/firebase/admin"
import { DashboardView } from "@/components/admin/dashboard-view"

// Opt out of static generation for the admin panel to ensure real-time telemetry is fetched on request
export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  let projectsCount = 0
  let unreadMessagesCount = 0
  let lastUpdated = "Never"

  try {
    // 1. Fetch total projects count
    const projectsSnapshot = await adminDb.collection("projects").get()
    projectsCount = projectsSnapshot.size
  } catch (error) {
    console.error("Failed to fetch projects count for dashboard:", error)
  }

  try {
    // 2. Fetch unread messages count
    const messagesSnapshot = await adminDb
      .collection("messages")
      .where("status", "==", "unread")
      .get()
    unreadMessagesCount = messagesSnapshot.size
  } catch (error) {
    console.error("Failed to fetch unread messages count for dashboard:", error)
  }

  try {
    // 3. Fetch GitHub activity sync status
    const githubDoc = await adminDb.collection("github_stats").doc("contributions").get()
    if (githubDoc.exists) {
      const data = githubDoc.data()
      if (data?.updated_at) {
        lastUpdated = new Date(data.updated_at).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC"
      }
    }
  } catch (error) {
    console.error("Failed to fetch github sync status for dashboard:", error)
  }

  return (
    <DashboardView
      initialProjectsCount={projectsCount}
      initialUnreadCount={unreadMessagesCount}
      initialLastUpdated={lastUpdated}
    />
  )
}
