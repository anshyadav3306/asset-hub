"use client"

import { useState, useEffect } from "react"
import { AssetsList } from "./assets-list"
import { CreateAssetForm } from "./create-asset-form"
import { AssignAssetDialog } from "./assign-asset-dialog"
import { AssetQRCode } from "./asset-qr-code"
import { QRScanner } from "./qr-scanner"
import { AssignmentHistoryDialog } from "./assignment-history-dialog"
import { DashboardView } from "./dashboard-view"
import { Button } from "./ui/button"
import { Tabs, TabsContent } from "./ui/tabs"
import { Plus, QrCode, ScanLine } from "lucide-react"
import { api } from "@/lib/api"
import { useFirebaseConnectivity } from "@/hooks/useFirebaseConnectivity"
import { SidebarNav } from "./sidebar-nav"
import { AddUserDialog } from "./add-user-dialog"

export type AssignmentHistory = {
  action: "assigned" | "unassigned"
  userName: string
  timestamp: string
}

export type Asset = {
  id: string
  assetTag: string
  name: string
  type: "hardware" | "software" | "other"
  serialNumber?: string
  categoryId?: string
  categoryName?: string
  departmentId?: string
  departmentName?: string
  locationId?: string
  locationName?: string
  assignedUserId?: string
  assignedUserName?: string
  status: "available" | "assigned" | "in_repair" | "retired" | "disposed"
  purchaseDate?: string
  warrantyExpiry?: string
  createdAt: string
  assignmentHistory?: AssignmentHistory[]
}

export function AssetsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showScannerDialog, setShowScannerDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false) // State for Add User dialog
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const { isConnected } = useFirebaseConnectivity()

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching assets from backend...")
      const fetchedAssets = await api.getAll()
      console.log("[v0] Fetched assets:", fetchedAssets.length)
      setAssets(fetchedAssets)
    } catch (error) {
      console.error("[v0] Failed to load assets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAsset = async (asset: Omit<Asset, "id" | "createdAt">) => {
    try {
      console.log("[v0] Creating new asset...")
      await api.create(asset)
      await loadAssets() // Refresh list
      setActiveTab("list")
    } catch (error) {
      console.error("[v0] Failed to create asset:", error)
    }
  }

  const handleAssignAsset = async (assetId: string, userId: string, userName: string) => {
    try {
      console.log("[v0] Assigning asset:", assetId, "to", userName)
      await api.assign(assetId, userId, userName)
      await loadAssets() // Refresh list
      setShowAssignDialog(false)
      setSelectedAsset(null)
    } catch (error) {
      console.error("[v0] Failed to assign asset:", error)
    }
  }

  const handleUnassignAsset = async (asset: Asset) => {
    try {
      console.log("[v0] Unassigning asset:", asset.id)
      await api.unassign(asset.id, asset.assignedUserName || "Unknown")
      await loadAssets() // Refresh list
    } catch (error) {
      console.error("[v0] Failed to unassign asset:", error)
    }
  }

  const handleViewHistory = (asset: Asset) => {
    setSelectedAsset(asset)
    setShowHistoryDialog(true)
  }

  const handleMarkInRepair = async (asset: Asset) => {
    try {
      await api.updateStatus(asset.id, "in_repair")
      await loadAssets()
    } catch (error) {
      console.error("[v0] Failed to mark in repair:", error)
    }
  }

  const handleMarkRetired = async (asset: Asset) => {
    try {
      await api.updateStatus(asset.id, "retired")
      await loadAssets()
    } catch (error) {
      console.error("[v0] Failed to mark retired:", error)
    }
  }

  const handleMarkAvailable = async (asset: Asset) => {
    try {
      await api.updateStatus(asset.id, "available")
      await loadAssets()
    } catch (error) {
      console.error("[v0] Failed to mark available:", error)
    }
  }

  const handleAddUser = async (user: { name: string; department: string; email: string }) => {
    try {
      console.log("[v0] Adding new user:", user)
      // In a real app, this would save to a 'users' collection in Firebase
      alert(`User ${user.name} added successfully!`)
      setShowAddUserDialog(false)
    } catch (error) {
      console.error("[v0] Failed to add user:", error)
    }
  }

  const inventoryStats = {
    total: assets.length,
    available: assets.filter((a) => a.status === "available").length,
    assigned: assets.filter((a) => a.status === "assigned").length,
    inRepair: assets.filter((a) => a.status === "in_repair").length,
    retired: assets.filter((a) => a.status === "retired").length,
    disposed: assets.filter((a) => a.status === "disposed").length,
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading assets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateAsset={() => setActiveTab("create")}
        onAddUser={() => setShowAddUserDialog(true)} // Linked to dialog
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="lg:pl-0 pl-12">
                <h1 className="text-xl font-semibold text-foreground">Asset Inventory</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Real-time tracking of organizational resources
                  {!loading && (
                    <span className="flex items-center gap-1 ml-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-medium">Live</span>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowScannerDialog(true)} className="gap-2">
                  <ScanLine className="h-4 w-4" />
                  Scan QR
                </Button>
                <Button size="sm" onClick={() => setActiveTab("create")} className="gap-2 hidden sm:flex">
                  <Plus className="h-4 w-4" />
                  New Asset
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <DashboardView stats={inventoryStats} />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <AssetsList
                assets={assets}
                onAssign={(asset) => {
                  setSelectedAsset(asset)
                  setShowAssignDialog(true)
                }}
                onGenerateQR={(asset) => {
                  setSelectedAsset(asset)
                  setShowQRDialog(true)
                }}
                onUnassign={handleUnassignAsset}
                onViewHistory={handleViewHistory}
                onMarkInRepair={handleMarkInRepair}
                onMarkRetired={handleMarkRetired}
                onMarkAvailable={handleMarkAvailable}
              />
            </TabsContent>

            <TabsContent value="create">
              <CreateAssetForm onSubmit={handleCreateAsset} onCancel={() => setActiveTab("list")} />
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Generate QR Codes</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Select an asset from the list to generate its QR code for easy scanning and tracking.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAsset(asset)
                        setShowQRDialog(true)
                      }}
                      className="rounded-lg border border-border bg-muted p-4 text-left transition-colors hover:bg-accent"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">{asset.assetTag}</span>
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="font-medium text-foreground">{asset.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{asset.categoryName}</div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialogs */}
      {showAssignDialog && selectedAsset && (
        <AssignAssetDialog
          asset={selectedAsset}
          open={showAssignDialog}
          onClose={() => {
            setShowAssignDialog(false)
            setSelectedAsset(null)
          }}
          onAssign={handleAssignAsset}
        />
      )}

      {showQRDialog && selectedAsset && (
        <AssetQRCode
          asset={selectedAsset}
          open={showQRDialog}
          onClose={() => {
            setShowQRDialog(false)
            setSelectedAsset(null)
          }}
        />
      )}

      {showScannerDialog && <QRScanner open={showScannerDialog} onClose={() => setShowScannerDialog(false)} />}

      {showHistoryDialog && selectedAsset && (
        <AssignmentHistoryDialog
          assetName={selectedAsset.name}
          history={selectedAsset.assignmentHistory || []}
          open={showHistoryDialog}
          onClose={() => {
            setShowHistoryDialog(false)
            setSelectedAsset(null)
          }}
        />
      )}

      {showAddUserDialog && (
        <AddUserDialog open={showAddUserDialog} onClose={() => setShowAddUserDialog(false)} onAdd={handleAddUser} />
      )}
    </div>
  )
}
