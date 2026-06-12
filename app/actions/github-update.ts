"use server"

import { adminDb } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"
import { fetchGitHubContributions, GitHubStats } from "@/lib/github/fetch-contributions"

export interface GitHubUpdateResponse {
  success: boolean
  lastUpdated?: string
  error?: string
  data?: GitHubStats
}

// Save stats to Firestore and revalidate
async function saveGitHubStatsToFirestore(stats: GitHubStats): Promise<string> {
  const nowStr = new Date().toISOString()
  
  await adminDb.collection("github_stats").doc("contributions").set(
    {
      totalContributions: stats.totalContributions,
      longestStreak: stats.longestStreak,
      activeRepos: stats.activeRepos,
      cells: stats.cells,
      updated_at: nowStr,
    },
    { merge: true }
  )

  // Revalidate public cache
  revalidatePath("/")
  
  return nowStr
}

export async function triggerGitHubUpdateAction(): Promise<GitHubUpdateResponse> {
  try {
    // Fetch fresh stats from GitHub API
    const stats = await fetchGitHubContributions()
    
    // Save to Firestore
    const updatedAt = await saveGitHubStatsToFirestore(stats)

    return {
      success: true,
      lastUpdated: new Date(updatedAt).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
      data: stats
    }
  } catch (error: any) {
    console.error("Failed to trigger GitHub manual update:", error)
    return { success: false, error: error?.message || "Failed to trigger update." }
  }
}

export async function getGitHubStatsAction(): Promise<GitHubUpdateResponse> {
  try {
    const docRef = adminDb.collection("github_stats").doc("contributions")
    const doc = await docRef.get()

    if (doc.exists) {
      const data = doc.data()
      const updatedAt = data?.updated_at

      // If data is fresh (less than 24 hours old), return it directly
      if (updatedAt) {
        const diffMs = Date.now() - new Date(updatedAt).getTime()
        const oneDayMs = 24 * 60 * 60 * 1000
        
        if (diffMs < oneDayMs) {
          const stats: GitHubStats = {
            totalContributions: data.totalContributions || 0,
            longestStreak: data.longestStreak || 0,
            activeRepos: data.activeRepos || 0,
            cells: data.cells || [],
            updatedAt: updatedAt,
          }
          return {
            success: true,
            lastUpdated: new Date(updatedAt).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
            data: stats,
          }
        }
      }
    }

    // If no document exists or it is older than 24 hours, perform an auto-update
    console.log("GitHub stats stale or missing. Performing automatic update...")
    const freshStats = await fetchGitHubContributions()
    const updatedAt = await saveGitHubStatsToFirestore(freshStats)

    return {
      success: true,
      lastUpdated: new Date(updatedAt).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
      data: freshStats,
    }
  } catch (error: any) {
    console.error("Failed to retrieve GitHub stats:", error)
    return { success: false, error: error?.message || "Failed to retrieve stats." }
  }
}
