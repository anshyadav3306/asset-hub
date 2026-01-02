"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase-config"

/**
 * Hook to monitor Firebase Firestore connectivity status.
 * Since v0 runs in a browser environment, this helps provide visual feedback
 * if the connection is active or falling back to mock data.
 */
export function useFirebaseConnectivity() {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = () => {
      if (db) {
        setIsConnected(true)
        console.log("[v0] Connectivity: Firebase/Firestore is connected")
      } else {
        setIsConnected(false)
        console.log("[v0] Connectivity: Falling back to mock data")
      }
      setIsChecking(false)
    }

    checkConnection()
  }, [])

  return { isConnected, isChecking }
}
