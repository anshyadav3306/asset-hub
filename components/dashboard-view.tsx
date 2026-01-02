"use client"

import { Package, CheckCircle2, UserCheck, Wrench, XCircle } from "lucide-react"

interface DashboardViewProps {
  stats: {
    total: number
    available: number
    assigned: number
    inRepair: number
    retired: number
  }
}

export function DashboardView({ stats }: DashboardViewProps) {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Snapshot of your organizational asset inventory.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-7xl">
        {/* Total Assets */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Assets</p>
            <div className="rounded-full bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.total}</p>
          <p className="mt-2 text-xs text-muted-foreground italic">Registered inventory</p>
        </div>

        {/* Available */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</p>
            <div className="rounded-full bg-emerald-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-500">{stats.available}</p>
          <p className="mt-2 text-xs text-muted-foreground italic">Ready to assign</p>
        </div>

        {/* Assigned */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned</p>
            <div className="rounded-full bg-blue-500/10 p-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-500">{stats.assigned}</p>
          <p className="mt-2 text-xs text-muted-foreground italic">Currently in use</p>
        </div>

        {/* In Repair */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Repair</p>
            <div className="rounded-full bg-yellow-500/10 p-2">
              <Wrench className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-yellow-500">{stats.inRepair}</p>
          <p className="mt-2 text-xs text-muted-foreground italic">Maintenance</p>
        </div>

        {/* Retired */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Retired</p>
            <div className="rounded-full bg-red-500/10 p-2">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-red-500">{stats.retired}</p>
          <p className="mt-2 text-xs text-muted-foreground italic">Decommissioned</p>
        </div>
      </div>
    </div>
  )
}
