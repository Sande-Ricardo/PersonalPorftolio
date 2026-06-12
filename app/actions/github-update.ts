"use server"

import { adminDb } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"

export interface GitHubUpdateResponse {
  success: boolean
  lastUpdated?: string
  error?: string
}

export async function triggerGitHubUpdateAction(): Promise<GitHubUpdateResponse> {
  try {
    // Simulate updating delay (real API fetch logic will be wired in Module 4)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const nowStr = new Date().toISOString()

    // Update Firestore github_stats document
    await adminDb.collection("github_stats").doc("contributions").set(
      {
        updated_at: nowStr,
      },
      { merge: true }
    )

    // Revalidate public cache
    revalidatePath("/")

    return {
      success: true,
      lastUpdated: new Date(nowStr).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
    }
  } catch (error: any) {
    console.error("Failed to trigger GitHub manual update:", error)
    return { success: false, error: error?.message || "Failed to trigger update." }
  }
}
