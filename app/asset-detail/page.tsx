"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Building2, User, Package, Wrench, CheckCircle, Download } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import QRCode from "react-qr-code"

type Asset = {
  id: string
  assetTag: string
  name: string
  type: "hardware" | "software" | "other"
  serialNumber?: string
  categoryName?: string
  departmentName?: string
  locationName?: string
  assignedUserName?: string
  status: "available" | "assigned" | "in_repair" | "retired" | "disposed"
  purchaseDate?: string
  warrantyExpiry?: string
  createdAt: string
}

const statusColors = {
  available: "bg-green-500/10 text-green-600 dark:text-green-400",
  assigned: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_repair: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  retired: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  disposed: "bg-red-500/10 text-red-600 dark:text-green-400",
}

const statusLabels = {
  available: "Available",
  assigned: "Assigned",
  in_repair: "In Repair",
  retired: "Retired",
  disposed: "Disposed",
}

export default function AssetDetailPage() {
  const searchParams = useSearchParams()
  const assetId = searchParams.get("id")
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock fetch - in production, fetch from Firebase
    const mockAssets: Asset[] = [
      {
        id: "1",
        assetTag: "LAPTOP-001",
        name: "Dell XPS 15",
        type: "hardware",
        serialNumber: "DXP15-2024-001",
        categoryName: "Laptops",
        departmentName: "Engineering",
        locationName: "Building A - Floor 3",
        status: "available",
        purchaseDate: "2024-01-15",
        warrantyExpiry: "2027-01-15",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        assetTag: "DESK-042",
        name: "Standing Desk Pro",
        type: "hardware",
        serialNumber: "SDP-2024-042",
        categoryName: "Furniture",
        departmentName: "Operations",
        locationName: "Building B - Floor 2",
        assignedUserName: "Ansh",
        status: "assigned",
        purchaseDate: "2024-02-10",
        createdAt: "2024-02-10",
      },
    ]

    const found = assetId ? mockAssets.find((a) => a.id === assetId) : null
    setAsset(found ?? null)
    setLoading(false)
  }, [assetId])

  const handleUpdateStatus = (newStatus: Asset["status"]) => {
    if (asset) {
      setAsset({ ...asset, status: newStatus })
      console.log(`[v0] Updated asset ${asset.id} status to ${newStatus}`)
      // In production, call api.updateAsset(asset.id, { status: newStatus })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading asset details...</div>

  if (!asset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Asset Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The requested asset could not be found.</p>
          <Link href="/">
            <Button className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assets
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Build the asset URL to embed in QR
  const assetUrl = typeof window !== "undefined" ? `${window.location.origin}/asset-detail?id=${asset.id}` : ""

  const handleDownloadQR = () => {
    const container = document.querySelector(`#qr-${asset.id}`) as HTMLElement | null
    const svg = container?.querySelector("svg") as SVGSVGElement | null
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.drawImage(img, 0, 0)
      const png = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = png
      link.download = `${asset.assetTag ?? "asset"}-qr.png`
      link.click()
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assets
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{asset.name}</h1>
              <div className="mt-1 flex items-center gap-3">
                <code className="text-sm font-medium text-muted-foreground">{asset.assetTag}</code>
                <Badge variant="secondary" className={statusColors[asset.status]}>
                  {statusLabels[asset.status]}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {asset.status !== "in_repair" ? (
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("in_repair")} className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Send to Repair
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("available")} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark Available
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div id={`qr-${asset.id}`} className="rounded border bg-white p-2">
              {assetUrl && <QRCode value={assetUrl} size={96} />}
            </div>
            <Button size="sm" onClick={handleDownloadQR} className="gap-2">
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Basic Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Asset Tag</dt>
                <dd className="mt-1 text-sm text-foreground">
                  <code className="rounded bg-muted px-2 py-1">{asset.assetTag}</code>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="mt-1 text-sm capitalize text-foreground">{asset.type}</dd>
              </div>
              {asset.serialNumber && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Serial Number</dt>
                  <dd className="mt-1 text-sm text-foreground">{asset.serialNumber}</dd>
                </div>
              )}
              {asset.categoryName && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd className="mt-1 text-sm text-foreground">{asset.categoryName}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Location & Assignment */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Location & Assignment</h2>
            <div className="space-y-4">
              {asset.locationName && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                    <dd className="mt-1 text-sm text-foreground">{asset.locationName}</dd>
                  </div>
                </div>
              )}
              {asset.departmentName && (
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                    <dd className="mt-1 text-sm text-foreground">{asset.departmentName}</dd>
                  </div>
                </div>
              )}
              {asset.assignedUserName && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Assigned To</dt>
                    <dd className="mt-1 text-sm text-foreground">{asset.assignedUserName}</dd>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Purchase Information */}
          {(asset.purchaseDate || asset.warrantyExpiry) && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Purchase Information</h2>
              <div className="space-y-4">
                {asset.purchaseDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Purchase Date</dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {new Date(asset.purchaseDate).toLocaleDateString()}
                      </dd>
                    </div>
                  </div>
                )}
                {asset.warrantyExpiry && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Warranty Expiry</dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {new Date(asset.warrantyExpiry).toLocaleDateString()}
                      </dd>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}