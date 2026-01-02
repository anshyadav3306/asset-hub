"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Clock, UserCheck, UserX } from "lucide-react"
import type { AssignmentHistory } from "./assets-page"

type AssignmentHistoryDialogProps = {
  assetName: string
  history: AssignmentHistory[]
  open: boolean
  onClose: () => void
}

export function AssignmentHistoryDialog({ assetName, history, open, onClose }: AssignmentHistoryDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assignment History - {assetName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {history.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No assignment history available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 rounded-full p-2 ${
                          entry.action === "assigned"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {entry.action === "assigned" ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              entry.action === "assigned"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            }
                          >
                            {entry.action === "assigned" ? "Assigned" : "Unassigned"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="mt-2 text-sm text-foreground">
                          {entry.action === "assigned" ? (
                            <>
                              Assigned to <span className="font-medium">{entry.userName}</span>
                            </>
                          ) : (
                            <>
                              Unassigned from <span className="font-medium">{entry.userName}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
