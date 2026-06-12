"use client"

import * as React from "react"
import Link from "next/link"
import { triggerGitHubUpdateAction } from "@/app/actions/github-update"

interface DashboardViewProps {
  initialProjectsCount: number
  initialUnreadCount: number
  initialLastUpdated: string
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialProjectsCount,
  initialUnreadCount,
  initialLastUpdated,
}) => {
  const [lastUpdated, setLastUpdated] = React.useState(initialLastUpdated)
  const [updating, setUpdating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleGitHubUpdate = async () => {
    setUpdating(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await triggerGitHubUpdateAction()
      if (res.success && res.lastUpdated) {
        setLastUpdated(res.lastUpdated)
        setSuccess(true)
      } else {
        setError(res.error || "Failed to trigger sync.")
      }
    } catch (err: any) {
      setError("Network or server action failure.")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Welcome metadata block */}
      <div className="border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ CMS_DASHBOARD_INITIALIZED ]
        </span>
        <h1 className="font-display text-2xl font-medium text-primary uppercase">
          SYSTEM_OVERVIEW.LOG
        </h1>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col justify-between min-h-[180px]">
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>

          <div>
            <span className="font-technical-label text-[10px] text-outline uppercase">
              DB_COLLECTION // PROJECTS
            </span>
            <div className="text-4xl font-bold font-display text-primary mt-4">
              {String(initialProjectsCount).padStart(2, "0")}
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-2">
              Total portfolio entries registered.
            </p>
          </div>

          <Link
            href="/admin/projects"
            className="font-technical-label text-[10px] text-primary hover:underline uppercase mt-4 block"
          >
            [ MANAGE_PROJECTS ]
          </Link>
        </div>

        {/* Messages Card */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col justify-between min-h-[180px]">
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>

          <div>
            <span className="font-technical-label text-[10px] text-outline uppercase">
              INBOX_QUEUE // MESSAGES
            </span>
            <div className="text-4xl font-bold font-display text-primary mt-4 flex items-center gap-3">
              {String(initialUnreadCount).padStart(2, "0")}
              {initialUnreadCount > 0 && (
                <span className="text-[10px] bg-white text-black px-2 py-0.5 font-technical-label animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-2">
              Unread contact inquiries pending review.
            </p>
          </div>

          <Link
            href="/admin/messages"
            className="font-technical-label text-[10px] text-primary hover:underline uppercase mt-4 block"
          >
            [ OPEN_INBOX ]
          </Link>
        </div>

        {/* GitHub stats Card */}
        <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none flex flex-col justify-between min-h-[180px]">
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>

          <div>
            <span className="font-technical-label text-[10px] text-outline uppercase">
              TELEMETRY_REFRESH // GITHUB
            </span>
            <div className="font-technical-label text-xs text-primary mt-4 leading-relaxed break-all">
              LAST_SYNC:
              <br />
              <span className="text-on-surface-variant font-bold">{lastUpdated}</span>
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-2">
              Contributions graph snapshot age.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGitHubUpdate}
              disabled={updating}
              className="font-technical-label text-[10px] text-primary hover:underline uppercase tracking-wider disabled:opacity-50 cursor-pointer text-left"
            >
              {updating ? "[ RUNNING_SYNC... ]" : "[ FORCE_SYNCHRONIZATION ]"}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Notifications */}
      {(success || error) && (
        <div className="font-technical-label text-xs border p-4 rounded-none">
          {success && (
            <div className="text-primary">
              &gt; STATUS_SUCCESS // GitHub activity heatmap telemetry cache successfully refreshed.
            </div>
          )}
          {error && (
            <div className="text-error border-error">
              &gt; STATUS_FAILURE // {error}
            </div>
          )}
        </div>
      )}

      {/* Terminal system specs section */}
      <div className="bg-[#191A1E] border border-outline-variant p-6 relative rounded-none">
        <span className="font-technical-label text-[10px] text-outline uppercase block mb-4">
          SYSTEM_METADATA.SH
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-on-surface-variant">
          <div>&gt; HOSTNAME: sandericardo-cms-node</div>
          <div>&gt; ENVIRONMENT: production</div>
          <div>&gt; DEPLOY_STRATEGY: static-regeneration</div>
          <div>&gt; PERSISTENCE_LAYER: cloud-firestore</div>
        </div>
      </div>
    </div>
  )
}
