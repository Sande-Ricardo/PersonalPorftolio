"use server"

import { getContentDoc, updateContentDoc, ContentMap } from "@/lib/db/content"
import { revalidatePath } from "next/cache"

export interface ContentActionResponse<T> {
  success: boolean
  data?: T | null
  error?: string
}

/**
 * Server Action to fetch a singleton content document by ID.
 */
export async function fetchContentDocAction<K extends keyof ContentMap>(
  id: K
): Promise<ContentActionResponse<ContentMap[K]>> {
  try {
    const data = await getContentDoc(id)
    return { success: true, data }
  } catch (error: any) {
    console.error(`fetchContentDocAction failed for ${id}:`, error)
    return { success: false, error: error?.message || "Failed to fetch document." }
  }
}

/**
 * Server Action to update a singleton content document.
 * Triggers revalidation on the home page.
 */
export async function updateContentDocAction<K extends keyof ContentMap>(
  id: K,
  data: ContentMap[K]
): Promise<ContentActionResponse<void>> {
  try {
    await updateContentDoc(id, data)
    
    // Automatically revalidate the root path to refresh ISR
    revalidatePath("/")
    
    return { success: true }
  } catch (error: any) {
    console.error(`updateContentDocAction failed for ${id}:`, error)
    return { success: false, error: error?.message || "Failed to update document." }
  }
}
