"use client"

import type React from "react"

import { useState } from "react"
import type { Asset } from "./assets-page"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { X } from "lucide-react"

type CreateAssetFormProps = {
  onSubmit: (asset: Omit<Asset, "id" | "createdAt">) => void
  onCancel: () => void
}

export function CreateAssetForm({ onSubmit, onCancel }: CreateAssetFormProps) {
  const [formData, setFormData] = useState({
    assetTag: "",
    name: "",
    type: "hardware" as "hardware" | "software" | "other",
    serialNumber: "",
    categoryId: "",
    categoryName: "",
    departmentId: "",
    departmentName: "",
    locationId: "",
    locationName: "",
    status: "available" as const,
    purchaseDate: "",
    warrantyExpiry: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Create New Asset</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add a new asset to your organization's inventory</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assetTag">
                Asset Tag <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assetTag"
                placeholder="e.g., LAPTOP-001"
                value={formData.assetTag}
                onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Asset Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Dell XPS 15"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "hardware" | "software" | "other") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="e.g., DXP15-2024-001"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Classification</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => setFormData({ ...formData, categoryName: value, categoryId: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laptops">Laptops</SelectItem>
                  <SelectItem value="Desktops">Desktops</SelectItem>
                  <SelectItem value="Monitors">Monitors</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Peripherals">Peripherals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.departmentName}
                onValueChange={(value) => setFormData({ ...formData, departmentName: value, departmentId: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.locationName}
                onValueChange={(value) => setFormData({ ...formData, locationName: value, locationId: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Building A - Floor 1">Building A - Floor 1</SelectItem>
                  <SelectItem value="Building A - Floor 2">Building A - Floor 2</SelectItem>
                  <SelectItem value="Building A - Floor 3">Building A - Floor 3</SelectItem>
                  <SelectItem value="Building B - Floor 1">Building B - Floor 1</SelectItem>
                  <SelectItem value="Building B - Floor 2">Building B - Floor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Purchase Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Asset</Button>
        </div>
      </form>
    </div>
  )
}
