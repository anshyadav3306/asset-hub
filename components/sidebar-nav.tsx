"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, QrCode, UserCircle, LogOut, Menu, X, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Assets", id: "list" },
  { icon: QrCode, label: "QR Labels", id: "qr" },
]

interface SidebarNavProps {
  onTabChange?: (tab: string) => void
  activeTab?: string
  onCreateAsset?: () => void
  onAddUser?: () => void
}

export function SidebarNav({ onTabChange, activeTab, onCreateAsset, onAddUser }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setIsOpen(false)
      else setIsOpen(true)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      {/* External toggle button (shows when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card text-card-foreground transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          !isOpen && "lg:w-0 lg:overflow-hidden lg:border-none",
        )}
      >
        <div className={cn("flex h-full flex-col", !isOpen && "invisible")}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <Package className="h-6 w-6" />
              <span>AssetFlow</span>
            </div>
            {/* Internal toggle button */}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main Menu
            </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange?.(item.id)
                  if (isMobile) setIsOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeTab === item.id ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}

            <div className="mt-6 space-y-2 px-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</div>
              <Button
                onClick={() => {
                  onCreateAsset?.()
                  if (isMobile) setIsOpen(false)
                }}
                className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                New Asset
              </Button>
              <Button
                onClick={() => {
                  onAddUser?.()
                  if (isMobile) setIsOpen(false)
                }}
                className="w-full justify-start gap-2 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border-none shadow-none"
                variant="outline"
              >
                <Users className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </nav>

          <div className="mt-auto border-t border-border p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <UserCircle className="h-8 w-8 text-muted-foreground" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Ansh</span>
                <span className="text-xs text-muted-foreground truncate">Administrator</span>
              </div>
            </div>
            <button className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
