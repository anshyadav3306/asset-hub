"use client"

import { useState } from "react"
import type { Asset } from "./assets-page"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

type AssignAssetDialogProps = {
  asset: Asset
  open: boolean
  onClose: () => void
  onAssign: (assetId: string, userId: string, userName: string) => void
}

const mockUsers = [
  { id: "1", name: "Ansh", department: "Engineering" },
  { id: "2", name: "Aditi", department: "Operations" },
  { id: "3", name: "Ankit", department: "Sales" },
  { id: "4", name: "Akash", department: "Marketing" },
]

export function AssignAssetDialog({ asset, open, onClose, onAssign }: AssignAssetDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState("")

  const handleAssign = () => {
    const user = mockUsers.find((u) => u.id === selectedUserId)
    if (user) {
      onAssign(asset.id, user.id, user.name)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Asset to User</DialogTitle>
          <DialogDescription>
            Select a user to assign this asset to. The asset status will be updated to "Assigned".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Asset Details</div>
            <div className="font-medium text-foreground">{asset.name}</div>
            <code className="text-xs text-muted-foreground">{asset.assetTag}</code>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user">
              Assign to User <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.department}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUserId}>
            Assign Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
