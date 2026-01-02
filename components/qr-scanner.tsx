"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Camera, X } from "lucide-react"
import { useRouter } from "next/navigation"
import jsQR from "jsqr"

type QRScannerProps = {
  open: boolean
  onClose: () => void
}

export function QRScanner({ open, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (open) {
      startScanning()
    } else {
      stopScanning()
    }

    return () => {
      stopScanning()
    }
  }, [open])

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScanning(true)
        setError(null)
        tick()
      }
    } catch (err) {
      setError("Unable to access camera. Please grant camera permissions.")
      console.error("[v0] Camera access error:", err)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setScanning(false)
  }

  const tick = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log("[v0] QR Code detected:", code.data)
          handleQRCodeDetected(code.data)
          return
        }
      }
    }

    animationRef.current = requestAnimationFrame(tick)
  }

  const handleQRCodeDetected = (data: string) => {
    stopScanning()
    // Check if it's an asset detail URL
    try {
      const url = new URL(data)
      if (url.pathname.includes("/asset-detail")) {
        router.push(data)
        onClose()
      } else {
        setError("Invalid QR code. Please scan an asset QR code.")
        setTimeout(() => {
          setError(null)
          startScanning()
        }, 2000)
      }
    } catch {
      setError("Invalid QR code format.")
      setTimeout(() => {
        setError(null)
        startScanning()
      }, 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan Asset QR Code</DialogTitle>
          <DialogDescription>Point your camera at an asset QR code to view its details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-border bg-black">
              <video ref={videoRef} className="h-full w-full" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-lg border-4 border-primary" />
                </div>
              )}
            </div>
          )}
          {!scanning && !error && (
            <div className="flex items-center justify-center rounded-lg border border-border bg-muted p-12">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Camera access required</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
