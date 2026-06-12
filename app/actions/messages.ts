"use server"

import { getMessagesList, markMessageAsReadDb, archiveMessageDb, MessageItem } from "@/lib/db/messages"
import { revalidatePath } from "next/cache"

export interface MessagesActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Server Action to fetch all messages.
 */
export async function fetchMessagesAction(): Promise<MessagesActionResponse<MessageItem[]>> {
  try {
    const list = await getMessagesList()
    return { success: true, data: list }
  } catch (error: any) {
    console.error("fetchMessagesAction failed:", error)
    return { success: false, error: error?.message || "Failed to fetch messages list." }
  }
}

/**
 * Server Action to mark a message as read.
 */
export async function markMessageAsReadAction(id: string): Promise<MessagesActionResponse<void>> {
  try {
    await markMessageAsReadDb(id)
    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error: any) {
    console.error(`markMessageAsReadAction failed for ${id}:`, error)
    return { success: false, error: error?.message || "Failed to mark message as read." }
  }
}

/**
 * Server Action to archive a message.
 */
export async function archiveMessageAction(id: string): Promise<MessagesActionResponse<void>> {
  try {
    await archiveMessageDb(id)
    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error: any) {
    console.error(`archiveMessageAction failed for ${id}:`, error)
    return { success: false, error: error?.message || "Failed to archive message." }
  }
}
