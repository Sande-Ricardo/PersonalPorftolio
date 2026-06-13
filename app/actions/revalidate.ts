"use server"

import { revalidatePath } from "next/cache"

export interface RevalidateResponse {
  success: boolean
  error?: string
}

/**
 * Server Action to manually trigger a deep cache revalidation of the entire site.
 */
export async function revalidateSitePathsAction(): Promise<RevalidateResponse> {
  try {
    // Purges cache for the root layout and recursively all sub-paths
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    console.error("Manual cache revalidation failed:", error)
    return { success: false, error: error?.message || "Failed to trigger revalidation." }
  }
}
