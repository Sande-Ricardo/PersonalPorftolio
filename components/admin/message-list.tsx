"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MessageItem } from "@/lib/db/messages"
import { markMessageAsReadAction, archiveMessageAction } from "@/app/actions/messages"

interface MessageListProps {
  initialMessages: MessageItem[]
}

type TabType = "active" | "unread" | "archived"

export const MessageList: React.FC<MessageListProps> = ({ initialMessages }) => {
  const router = useRouter()
  const [messages, setMessages] = React.useState<MessageItem[]>(initialMessages)
  const [activeTab, setActiveTab] = React.useState<TabType>("active")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [loadingAction, setLoadingAction] = React.useState<"read" | "archive" | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Filter messages based on tab selection
  const filteredMessages = React.useMemo(() => {
    return messages.filter((msg) => {
      if (activeTab === "unread") {
        return msg.status === "unread"
      }
      if (activeTab === "archived") {
        return msg.status === "archived"
      }
      // Active tab: unread and read
      return msg.status === "unread" || msg.status === "read"
    })
  }, [messages, activeTab])

  // Get active selected message object
  const selectedMessage = React.useMemo(() => {
    return messages.find((msg) => msg.id === selectedId) || null
  }, [messages, selectedId])

  // If a message is selected, automatically mark it as read after a short delay (e.g. 1 second)
  React.useEffect(() => {
    if (selectedMessage && selectedMessage.status === "unread") {
      const timer = setTimeout(async () => {
        try {
          const res = await markMessageAsReadAction(selectedMessage.id)
          if (res.success) {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === selectedMessage.id ? { ...msg, status: "read" } : msg))
            )
            router.refresh()
          }
        } catch (err) {
          console.error("Auto-marking message as read failed:", err)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [selectedId, selectedMessage, router])

  const handleMarkAsRead = async (id: string) => {
    setLoadingAction("read")
    setError(null)
    try {
      const res = await markMessageAsReadAction(id)
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: "read" } : msg))
        )
        router.refresh()
      } else {
        setError(res.error || "Failed to mark message as read.")
      }
    } catch (err) {
      setError("Network error occurred.")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm("Move this message to the archive log?")) {
      return
    }
    setLoadingAction("archive")
    setError(null)
    try {
      const res = await archiveMessageAction(id)
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: "archived" } : msg))
        )
        setSelectedId(null) // deselect
        router.refresh()
      } else {
        setError(res.error || "Failed to archive message.")
      }
    } catch (err) {
      setError("Network error occurred.")
    } finally {
      setLoadingAction(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      {/* Top tab controller */}
      <div className="flex border-b border-outline-variant pb-4 gap-2">
        {(["active", "unread", "archived"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab
          const count = messages.filter((msg) => {
            if (tab === "unread") return msg.status === "unread"
            if (tab === "archived") return msg.status === "archived"
            return msg.status === "unread" || msg.status === "read"
          }).length

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSelectedId(null) // Reset selection on tab change
              }}
              className={`px-4 py-2 border font-technical-label text-[10px] tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-outline border-outline-variant hover:text-white hover:border-outline"
              }`}
            >
              [ {tab}_queue ({count}) ]
            </button>
          )
        })}
      </div>

      {error && (
        <div className="font-technical-label text-xs text-error border border-error bg-error/10 p-4">
          &gt; ERROR: {error}
        </div>
      )}

      {/* Main dual pane workspace */}
      <div className="flex flex-col md:flex-row gap-6 h-[600px] items-stretch">
        {/* Left Pane: Message Queue */}
        <div
          className={`w-full md:w-2/5 border border-outline-variant bg-[#191A1E] flex flex-col h-full ${
            selectedId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header info */}
          <div className="border-b border-outline-variant/60 p-4 bg-white/2 font-technical-label text-[10px] text-outline uppercase tracking-wider">
            QUEUE_ENTRIES // COUNT: {filteredMessages.length}
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/40">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-mono text-xs">
                &gt; NO_MESSAGES_FOUND
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedId
                const isUnread = msg.status === "unread"
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedId(msg.id)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-2 rounded-none border-l-2 cursor-pointer ${
                      isSelected
                        ? "bg-white/5 border-l-primary"
                        : isUnread
                        ? "bg-white/2 border-l-white"
                        : "border-l-transparent hover:bg-white/2"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-technical-label text-xs font-bold text-primary truncate max-w-[150px]">
                        {msg.name}
                      </span>
                      <span className="font-technical-label text-[9px] text-outline whitespace-nowrap">
                        {formatDate(msg.received_at).split(",")[0]}
                      </span>
                    </div>

                    {msg.projectType && (
                      <div className="font-technical-label text-[9px] text-outline uppercase tracking-wider truncate">
                        TYPE: {msg.projectType}
                      </div>
                    )}

                    <div className="font-mono text-xs text-on-surface-variant line-clamp-1 break-all">
                      {msg.message}
                    </div>

                    {isUnread && (
                      <div className="mt-1">
                        <span className="bg-white text-black px-1.5 py-0.5 font-technical-label text-[8px] tracking-wider uppercase font-bold">
                          UNREAD
                        </span>
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Selected Details */}
        <div
          className={`w-full md:w-3/5 border border-outline-variant bg-[#191A1E] flex flex-col h-full relative ${
            selectedId ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedMessage ? (
            <div className="flex flex-col h-full p-6">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>

              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="md:hidden mb-4 font-technical-label text-xs text-primary hover:underline uppercase tracking-widest cursor-pointer text-left"
              >
                &lt; [ BACK_TO_QUEUE ]
              </button>

              {/* Metadata block */}
              <div className="border-b border-outline-variant/60 pb-4 mb-4 flex flex-col gap-2">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-technical-label text-[9px] text-outline uppercase">
                      SENDER_IDENTITY
                    </span>
                    <h2 className="font-display text-lg font-bold text-primary leading-tight">
                      {selectedMessage.name}
                    </h2>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-mono text-xs text-outline hover:text-primary hover:underline break-all"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="text-right">
                    <span className="font-technical-label text-[9px] text-outline uppercase block">
                      TIMESTAMP
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant block">
                      {formatDate(selectedMessage.received_at)}
                    </span>
                  </div>
                </div>

                {selectedMessage.projectType && (
                  <div className="mt-2">
                    <span className="font-technical-label text-[9px] text-outline uppercase block">
                      PROJECT_TYPE_INQUIRY
                    </span>
                    <span className="font-technical-label text-[10px] text-primary border border-outline-variant px-2 py-0.5 inline-block uppercase bg-white/2 mt-1">
                      {selectedMessage.projectType}
                    </span>
                  </div>
                )}
              </div>

              {/* Message text content */}
              <div className="flex-1 overflow-y-auto mb-6">
                <span className="font-technical-label text-[9px] text-outline uppercase block mb-2">
                  MESSAGE_BODY.TXT
                </span>
                <div className="border border-outline-variant/60 bg-[#141313] p-4 text-on-surface select-text font-mono text-xs leading-relaxed whitespace-pre-wrap h-[200px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="border-t border-outline-variant/60 pt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: Inquiry from sande.dev`
                  )}&body=${encodeURIComponent(`Hi ${selectedMessage.name},\n\n`)}`}
                  className="px-4 py-2 bg-white text-black font-technical-label text-[10px] font-bold tracking-widest uppercase hover:opacity-90 active:scale-95 transition-transform"
                >
                  [ REPLY_VIA_EMAIL ]
                </a>

                {selectedMessage.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    disabled={loadingAction !== null}
                    className="px-4 py-2 border border-outline-variant text-primary font-technical-label text-[10px] tracking-widest uppercase hover:bg-white hover:text-black cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "read" ? "[ WORKING... ]" : "[ MARK_AS_READ ]"}
                  </button>
                )}

                {selectedMessage.status !== "archived" && (
                  <button
                    onClick={() => handleArchive(selectedMessage.id)}
                    disabled={loadingAction !== null}
                    className="px-4 py-2 border border-error/50 text-error font-technical-label text-[10px] tracking-widest uppercase hover:bg-error hover:text-black cursor-pointer disabled:opacity-50 ml-auto"
                  >
                    {loadingAction === "archive" ? "[ WORKING... ]" : "[ ARCHIVE ]"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-outline font-technical-label text-xs">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>
              &gt; SELECT_A_MESSAGE_FROM_THE_QUEUE // NO_ACTIVE_SELECTION
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
