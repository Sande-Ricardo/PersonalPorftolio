"use client"

import * as React from "react"

interface ContributionCell {
  date: string
  count: number
  level: number
}

export const GitHubContributions: React.FC = () => {
  const [latency, setLatency] = React.useState("JUST NOW")

  // Generate 371 days of simulated commit history
  const cells = React.useMemo(() => {
    const list: ContributionCell[] = []
    const today = new Date()

    for (let i = 370; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Simulate realistic commit distribution
      const rand = Math.random()
      let count = 0
      let level = 0

      if (rand > 0.92) {
        count = Math.floor(Math.random() * 5) + 8
        level = 4
      } else if (rand > 0.85) {
        count = Math.floor(Math.random() * 4) + 4
        level = 3
      } else if (rand > 0.75) {
        count = Math.floor(Math.random() * 3) + 2
        level = 2
      } else if (rand > 0.5) {
        count = 1
        level = 1
      }

      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      list.push({ date: dateString, count, level })
    }
    return list
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
                [ 2,048 ]
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-technical-label text-technical-label text-on-surface-variant uppercase">
                &gt; LONGEST_STREAK:
              </span>
              <span className="font-technical-label text-[20px] leading-none text-primary font-bold">
                [ 42 DAYS ]
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-technical-label text-technical-label text-on-surface-variant uppercase">
                &gt; ACTIVE_REPOS:
              </span>
              <span className="font-technical-label text-[20px] leading-none text-primary font-bold">
                [ 14 ]
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant mt-auto">
            <span className="font-technical-label text-[10px] text-outline uppercase block opacity-50">
              SYS.UPDATE: {latency}
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
              {cells.map((cell, idx) => (
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
