"use client"

import { useState } from "react"
import type { Asset } from "./assets-page"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Download, Copy, Check } from "lucide-react"
import QRCode from "react-qr-code"

type AssetQRCodeProps = {
  asset: Asset
  open: boolean
  onClose: () => void
}

export function AssetQRCode({ asset, open, onClose }: AssetQRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  const assetUrl = typeof window !== "undefined" ? `${window.location.origin}/asset-detail?id=${asset.id}` : ""

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(assetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setQrError((err as Error).message)
    }
  }

  const handleDownload = () => {
    const container = document.getElementById(`qr-svg-${asset.id}`)
    const svg = container?.querySelector("svg") as SVGSVGElement | null
    if (!svg) {
      setQrError("QR SVG not found")
      return
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width || 256
        canvas.height = img.height || 256
        const ctx = canvas.getContext("2d")
        if (ctx) ctx.drawImage(img, 0, 0)
        const png = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = png
        link.download = `${asset.assetTag}-qr.png`
        link.click()
        URL.revokeObjectURL(url)
      }
      img.onerror = () => {
        setQrError("Failed to convert QR to PNG")
        URL.revokeObjectURL(url)
      }
      img.src = url
    } catch (err) {
      setQrError((err as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Asset QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to quickly access asset details on any device with camera access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">{asset.name}</div>
                <code className="text-xs text-muted-foreground">{asset.assetTag}</code>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-lg border border-border bg-white p-4">
              {qrError ? (
                <div className="flex h-64 w-64 items-center justify-center text-sm text-red-500">Error: {qrError}</div>
              ) : (
                <div id={`qr-svg-${asset.id}`} className="flex items-center justify-center p-2">
                  {assetUrl && <QRCode value={assetUrl} size={256} />}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <strong>Note:</strong> Users must be authenticated to view asset details. Cross-tenant access is
            automatically blocked for security.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}