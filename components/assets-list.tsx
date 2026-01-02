"use client"

import { useState } from "react"
import type { Asset } from "./assets-page"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Search, UserPlus, QrCode, MoreVertical, UserMinus, History, Wrench, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"

type AssetsListProps = {
  assets: Asset[]
  onAssign: (asset: Asset) => void
  onGenerateQR: (asset: Asset) => void
  onUnassign: (asset: Asset) => void
  onViewHistory: (asset: Asset) => void
  onMarkInRepair: (asset: Asset) => void
  onMarkRetired: (asset: Asset) => void
  onMarkAvailable: (asset: Asset) => void
}

const statusColors = {
  available: "bg-green-500/10 text-green-600 dark:text-green-400",
  assigned: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_repair: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  retired: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  disposed: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const statusLabels = {
  available: "Available",
  assigned: "Assigned",
  in_repair: "In Repair",
  retired: "Retired",
  disposed: "Disposed",
}

export function AssetsList({
  assets,
  onAssign,
  onGenerateQR,
  onUnassign,
  onViewHistory,
  onMarkInRepair,
  onMarkRetired,
  onMarkAvailable,
}: AssetsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all") // changed typeFilter to categoryFilter

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesCategory = categoryFilter === "all" || asset.categoryName === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(assets.map((a) => a.categoryName).filter(Boolean)))

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, tag, or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_repair">In Repair</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat!}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Asset Tag
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-xs font-medium text-foreground">{asset.assetTag}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-foreground">{asset.name}</div>
                    {asset.serialNumber && (
                      <div className="text-xs text-muted-foreground">SN: {asset.serialNumber}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{asset.categoryName || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{asset.locationName || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{asset.assignedUserName || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={statusColors[asset.status]}>
                      {statusLabels[asset.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onGenerateQR(asset)}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {asset.status === "assigned" && asset.assignedUserName ? (
                            <DropdownMenuItem onClick={() => onUnassign(asset)}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Unassign from User
                            </DropdownMenuItem>
                          ) : (
                            asset.status === "available" && (
                              <DropdownMenuItem onClick={() => onAssign(asset)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign to User
                              </DropdownMenuItem>
                            )
                          )}
                          <DropdownMenuItem onClick={() => onGenerateQR(asset)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewHistory(asset)}>
                            <History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {asset.status !== "in_repair" && asset.status !== "retired" && (
                            <DropdownMenuItem onClick={() => onMarkInRepair(asset)}>
                              <Wrench className="mr-2 h-4 w-4" />
                              Mark as In Repair
                            </DropdownMenuItem>
                          )}
                          {asset.status !== "retired" && asset.status !== "in_repair" && (
                            <DropdownMenuItem onClick={() => onMarkRetired(asset)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark as Retired
                            </DropdownMenuItem>
                          )}
                          {(asset.status === "in_repair" || asset.status === "retired") && (
                            <DropdownMenuItem onClick={() => onMarkAvailable(asset)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark as Available
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAssets.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No assets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}