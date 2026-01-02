// Loosely Coupled API Layer - Easy to swap Firebase with another backend
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase-config"
import type { Asset } from "@/components/assets-page"

const getDb = () => {
  if (!db) {
    console.warn("[v0] ⚠️ Firestore db is undefined in api.ts, attempting to re-import or wait...")
  }
  return db
}

// Collections
const ASSETS_COLLECTION = "assets"

// Helper to convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString()
  }
  return timestamp || new Date().toISOString()
}

// Asset API - All backend operations in one place
export const assetApi = {
  // Fetch all assets
  async getAll(): Promise<Asset[]> {
    try {
      const database = getDb()
      if (!database) {
        console.error("[v0] ❌ Firestore not ready, falling back to mock data")
        return mockApi.getAll()
      }
      console.log("[v0] 📥 Fetching all assets from Firebase...")
      const q = query(collection(database, ASSETS_COLLECTION), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      console.log("[v0] ✅ Fetched", snapshot.docs.length, "assets")

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          assetTag: data.assetTag,
          name: data.name,
          type: data.type,
          serialNumber: data.serialNumber,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          departmentId: data.departmentId,
          departmentName: data.departmentName,
          locationId: data.locationId,
          locationName: data.locationName,
          assignedUserId: data.assignedUserId,
          assignedUserName: data.assignedUserName,
          status: data.status,
          purchaseDate: data.purchaseDate,
          warrantyExpiry: data.warrantyExpiry,
          createdAt: convertTimestamp(data.createdAt),
          assignmentHistory: data.assignmentHistory || [],
        }
      })
    } catch (error) {
      console.error("[v0] ❌ Error fetching assets:", error)
      return mockApi.getAll()
    }
  },

  // Fetch single asset by id
  async getById(id: string): Promise<Asset | null> {
    try {
      const database = getDb()
      if (!database) {
        console.error("[v0] ❌ Firestore not ready, cannot get asset")
        return null
      }
      console.log("[v0] 📥 Fetching asset by id from Firebase...", id)
      const docRef = doc(database, ASSETS_COLLECTION, id)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) {
        console.log("[v0] ⚠️ Asset not found:", id)
        return null
      }
      const data = snapshot.data()
      return {
        id: snapshot.id,
        assetTag: data.assetTag,
        name: data.name,
        type: data.type,
        serialNumber: data.serialNumber,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        locationId: data.locationId,
        locationName: data.locationName,
        assignedUserId: data.assignedUserId,
        assignedUserName: data.assignedUserName,
        status: data.status,
        purchaseDate: data.purchaseDate,
        warrantyExpiry: data.warrantyExpiry,
        createdAt: convertTimestamp(data.createdAt),
        assignmentHistory: data.assignmentHistory || [],
      }
    } catch (error) {
      console.error("[v0] ❌ Error fetching asset by id:", error)
      return null
    }
  },

  // Create new asset
  async create(asset: Omit<Asset, "id" | "createdAt">): Promise<string> {
    try {
      const database = getDb()
      if (!database) throw new Error("Firestore not initialized")
      console.log("[v0] 📤 Creating new asset:", asset.name)
      const docRef = await addDoc(collection(database, ASSETS_COLLECTION), {
        ...asset,
        createdAt: serverTimestamp(),
        assignmentHistory: [],
      })
      console.log("[v0] ✅ Asset created with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("[v0] ❌ Error creating asset:", error)
      throw error
    }
  },

  // Update asset
  async update(id: string, updates: Partial<Asset>): Promise<void> {
    try {
      const database = getDb()
      const assetRef = doc(database, ASSETS_COLLECTION, id)
      await updateDoc(assetRef, updates)
      console.log("[v0] Asset updated:", id)
    } catch (error) {
      console.error("[v0] Error updating asset:", error)
      throw error
    }
  },

  // Assign asset to user
  async assign(id: string, userId: string, userName: string): Promise<void> {
    try {
      const database = getDb()
      const assetRef = doc(database, ASSETS_COLLECTION, id)

      // Get current history
      const snapshot = await getDocs(query(collection(database, ASSETS_COLLECTION)))
      const assetDoc = snapshot.docs.find((doc) => doc.id === id)
      const currentHistory = assetDoc?.data().assignmentHistory || []

      await updateDoc(assetRef, {
        assignedUserId: userId,
        assignedUserName: userName,
        status: "assigned",
        assignmentHistory: [
          ...currentHistory,
          {
            action: "assigned",
            userName,
            timestamp: new Date().toISOString(),
          },
        ],
      })
      console.log("[v0] Asset assigned:", id, "to", userName)
    } catch (error) {
      console.error("[v0] Error assigning asset:", error)
      throw error
    }
  },

  // Unassign asset
  async unassign(id: string, userName: string): Promise<void> {
    try {
      const database = getDb()
      const assetRef = doc(database, ASSETS_COLLECTION, id)

      // Get current history
      const snapshot = await getDocs(query(collection(database, ASSETS_COLLECTION)))
      const assetDoc = snapshot.docs.find((doc) => doc.id === id)
      const currentHistory = assetDoc?.data().assignmentHistory || []

      await updateDoc(assetRef, {
        assignedUserId: null,
        assignedUserName: null,
        status: "available",
        assignmentHistory: [
          ...currentHistory,
          {
            action: "unassigned",
            userName,
            timestamp: new Date().toISOString(),
          },
        ],
      })
      console.log("[v0] Asset unassigned:", id)
    } catch (error) {
      console.error("[v0] Error unassigning asset:", error)
      throw error
    }
  },

  // Update asset status
  async updateStatus(id: string, status: Asset["status"]): Promise<void> {
    try {
      const database = getDb()
      const assetRef = doc(database, ASSETS_COLLECTION, id)
      await updateDoc(assetRef, { status })
      console.log("[v0] Asset status updated:", id, "to", status)
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      throw error
    }
  },
}

// Export a mock API for development/testing (easy switch)
export const mockApi = {
  async getAll(): Promise<Asset[]> {
    return [
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
        assignmentHistory: [],
      },
    ]
  },
  async create(asset: any): Promise<string> {
    return String(Date.now())
  },
  async update(id: string, updates: any): Promise<void> {},
  async assign(id: string, userId: string, userName: string): Promise<void> {},
  async unassign(id: string, userName: string): Promise<void> {},
  async updateStatus(id: string, status: any): Promise<void> {},
}

// Choose which API to use (easy switch for your instructor)
export const api = assetApi // Change to mockApi for local development without Firebase