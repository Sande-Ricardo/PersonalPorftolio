import * as React from "react"
import { getMessagesList, MessageItem } from "@/lib/db/messages"
import { MessageList } from "@/components/admin/message-list"

// Opt out of static generation for the inbox to ensure we pull latest messages on page request
export const dynamic = "force-dynamic"

export default async function MessagesInboxPage() {
  let messages: MessageItem[] = []
  try {
    messages = await getMessagesList()
  } catch (error) {
    console.error("Failed to load messages inbox:", error)
  }

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ SYSTEM_MESSAGES_INBOX ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          CONTACT_MESSAGES.LOG
        </h1>
      </div>

      <MessageList initialMessages={messages} />
    </div>
  )
}
