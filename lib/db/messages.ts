import { adminDb } from "@/lib/firebase/admin"

export interface MessageItem {
  id: string
  name: string
  email: string
  projectType?: string
  message: string
  status: "unread" | "read" | "archived"
  received_at: string
}

/**
 * Fetches all messages from the Firestore `messages` collection, ordered by received_at descending.
 */
export async function getMessagesList(): Promise<MessageItem[]> {
  try {
    const snapshot = await adminDb
      .collection("messages")
      .orderBy("received_at", "desc")
      .get()
    
    const list: MessageItem[] = []
    snapshot.forEach((doc) => {
      list.push({
        id: doc.id,
        ...(doc.data() as Omit<MessageItem, "id">),
      })
    })
    return list
  } catch (error) {
    console.error("Failed to fetch messages list from Firestore:", error)
    throw error
  }
}

/**
 * Marks a message status as "read" in Firestore.
 */
export async function markMessageAsReadDb(id: string): Promise<void> {
  try {
    await adminDb.collection("messages").doc(id).update({
      status: "read",
    })
  } catch (error) {
    console.error(`Failed to mark message ${id} as read:`, error)
    throw error
  }
}

/**
 * Archives a message by setting its status as "archived" in Firestore.
 */
export async function archiveMessageDb(id: string): Promise<void> {
  try {
    await adminDb.collection("messages").doc(id).update({
      status: "archived",
    })
  } catch (error) {
    console.error(`Failed to archive message ${id}:`, error)
    throw error
  }
}
