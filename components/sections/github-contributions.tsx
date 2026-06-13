"use client"

import * as React from "react"

import { getGitHubStatsAction } from "@/app/actions/github-update"
import type { GitHubStats, ContributionCell } from "@/lib/github/fetch-contributions"

export const GitHubContributions: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const [stats, setStats] = React.useState<GitHubStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)

    let active = true
    getGitHubStatsAction()
      .then((res) => {
        if (!active) return
        if (res.success && res.data) {
          setStats(res.data)
        } else {
          setError(res.error || "Failed to load telemetry")
        }
        setLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || "An unexpected error occurred")
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const getCellColorClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-zinc-800"
      case 2:
        return "bg-zinc-600"
      case 3:
        return "bg-zinc-400"
      case 4:
        return "bg-white"
      default:
        return "bg-[#191A1E] border border-white/5"
    }
  }

  // Display skeleton during loading/initialization
  if (!mounted || loading) {
    return (
      <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
        {/* Module Header */}
        <div className="flex justify-between items-center py-2 border-y border-outline-variant font-technical-label text-technical-label uppercase w-full mb-12">
          <span className="text-primary tracking-widest">[ TELEMETRY ] :: GITHUB_ACTIVITY_LOG</span>
          <span className="text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 bg-primary inline-block animate-pulse" />
            STATUS: INITIALIZING...
          </span>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 border border-outline-variant bg-[#191A1E] h-[250px] items-stretch">
          <div className="col-span-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-between">
            <div className="font-technical-label text-technical-label text-outline uppercase animate-pulse">
              &gt; ESTABLISHING_CONNECTIVITY
            </div>
            <div className="font-technical-label text-[10px] text-outline uppercase block opacity-50">
              SYS.UPDATE: PENDING
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 p-6 flex items-center justify-center font-technical-label text-xs text-outline bg-background">
            &gt; STABILIZING_MATRIX // EST_CONNECTIVITY...
          </div>
        </div>
      </section>
    )
  }

  // Fallback if load fails
  if (error || !stats) {
    return (
      <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
        <div className="flex justify-between items-center py-2 border-y border-outline-variant font-technical-label text-technical-label uppercase w-full mb-12">
          <span className="text-primary tracking-widest">[ TELEMETRY ] :: GITHUB_ACTIVITY_LOG</span>
          <span className="text-error flex items-center gap-2">
            <span className="w-2 h-2 bg-error inline-block" />
            STATUS: OFFLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 border border-outline-variant bg-[#191A1E] h-[250px] items-stretch">
          <div className="col-span-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-between">
            <div className="font-technical-label text-error uppercase">
              &gt; TELEMETRY_OFFLINE
            </div>
            <div className="font-technical-label text-[10px] text-error uppercase block opacity-50">
              SYS.UPDATE: FAILED
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 p-6 flex flex-col items-center justify-center font-technical-label text-xs text-on-surface-variant bg-background gap-2">
            <div>&gt; LINK_FAULT // {error || "DATA_ACQUISITION_TIMEOUT"}</div>
            <div className="opacity-50">PLEASE VERIFY GITHUB_TOKEN CREDENTIALS IN THE SERVER ENVIRONMENT</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      {/* Module Header */}
      <div className="flex justify-between items-center py-2 border-y border-outline-variant font-technical-label text-technical-label uppercase w-full mb-12">
        <span className="text-primary tracking-widest">[ TELEMETRY ] :: GITHUB_ACTIVITY_LOG</span>
        <span className="text-on-surface-variant flex items-center gap-2">
          <span className="w-2 h-2 bg-primary inline-block animate-pulse" />
          STATUS: TRACKING_ACTIVE
        </span>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-outline-variant bg-[#191A1E] relative overflow-hidden">
        {/* Abstract blueprint lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "100% 24px",
          }}
        />

        {/* Scanline Animation */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 pointer-events-none animate-[scan_8s_linear_infinite]" />

        {/* Telemetry Panel (Left Col) */}
        <div className="col-span-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col gap-8 justify-between relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-technical-label text-technical-label text-on-surface-variant uppercase">
                &gt; TOTAL_COMMITS_YTD:
              </span>
              <span className="font-technical-label text-[32px] leading-none text-primary font-bold">
                [ {stats.totalContributions.toLocaleString()} ]
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-technical-label text-technical-label text-on-surface-variant uppercase">
                &gt; LONGEST_STREAK:
              </span>
              <span className="font-technical-label text-[20px] leading-none text-primary font-bold">
                [ {stats.longestStreak} DAYS ]
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-technical-label text-technical-label text-on-surface-variant uppercase">
                &gt; ACTIVE_REPOS:
              </span>
              <span className="font-technical-label text-[20px] leading-none text-primary font-bold">
                [ {stats.activeRepos} ]
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant mt-auto">
            <span className="font-technical-label text-[10px] text-outline uppercase block opacity-50">
              SYS.UPDATE: {new Date(stats.updatedAt).toLocaleString("en-US", { timeZoneName: "short" })}
            </span>
          </div>
        </div>

        {/* Contributions Graph (Right Cols) */}
        <div className="col-span-1 md:col-span-3 p-6 flex flex-col relative overflow-hidden bg-background z-10">
          {/* Months header */}
          <div className="flex justify-between items-end mb-4 font-technical-label text-technical-label text-on-surface-variant w-full overflow-x-hidden text-[10px]">
            <div className="flex w-full justify-between pr-2">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
              <span>NOV</span>
              <span>DEC</span>
            </div>
          </div>

          <div className="flex gap-2 w-full overflow-x-auto pb-4 custom-scrollbar">
            {/* Days list */}
            <div className="flex flex-col justify-between font-technical-label text-[9px] text-on-surface-variant h-[96px] pr-2 mt-[2px] select-none">
              <span>MON</span>
              <span>WED</span>
              <span>FRI</span>
            </div>

            {/* Heatmap Grid in Column Flow */}
            <div className="grid grid-flow-col grid-rows-7 gap-[2px] w-max select-none">
              {stats.cells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`w-[12px] h-[12px] transition-all duration-100 hover:scale-125 hover:brightness-125 hover:border hover:border-white z-0 hover:z-20 cursor-crosshair ${getCellColorClass(
                    cell.level
                  )}`}
                  title={`${cell.date} :: ${cell.count} commits`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-end items-center gap-2 font-technical-label text-technical-label text-outline uppercase border-t border-outline-variant pt-4 w-full text-[10px]">
            <span>Less</span>
            <div className="flex gap-1 mx-2">
              <div className="w-3 h-3 bg-[#191A1E] border border-white/5" />
              <div className="w-3 h-3 bg-zinc-800" />
              <div className="w-3 h-3 bg-zinc-600" />
              <div className="w-3 h-3 bg-zinc-400" />
              <div className="w-3 h-3 bg-white" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  )
}
