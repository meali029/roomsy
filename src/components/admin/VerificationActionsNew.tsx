"use client"

import { useState } from "react"
import { Check, X, Ban, AlertTriangle, UserCheck } from "lucide-react"

interface VerificationActionsProps {
  userId: string
  requestId: string
  userName: string
  userEmail: string
  isBanned?: boolean
  onActionComplete: (action: string, requestId: string) => void
}

export default function VerificationActions({ 
  userId, 
  requestId, 
  userName, 
  userEmail,
  isBanned = false,
  onActionComplete 
}: VerificationActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [banReason, setBanReason] = useState("")
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleVerification = async (action: "approve" | "reject") => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action
        })
      })

      if (response.ok) {
        setActionSuccess(action === "approve" ? "approved" : "rejected")
        setTimeout(() => {
          onActionComplete(action, requestId)
        }, 1500)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to process verification"}`)
      }
    } catch (error) {
      console.error("Verification error:", error)
      alert("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBan = async () => {
    if (!banReason.trim() || isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "ban",
          banReason: banReason.trim()
        })
      })

      if (response.ok) {
        setShowBanDialog(false)
        setBanReason("")
        setActionSuccess("banned")
        setTimeout(() => {
          onActionComplete("ban", requestId)
        }, 1500)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to ban user"}`)
      }
    } catch (error) {
      console.error("Ban error:", error)
      alert("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnban = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "unban"
        })
      })

      if (response.ok) {
        setActionSuccess("unbanned")
        setTimeout(() => {
          onActionComplete("unban", requestId)
        }, 1500)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to unban user"}`)
      }
    } catch (error) {
      console.error("Unban error:", error)
      alert("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (actionSuccess) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800 capitalize">
          {actionSuccess === "approved" && "User Verified"}
          {actionSuccess === "rejected" && "Verification Rejected"}
          {actionSuccess === "banned" && "User Banned"}
          {actionSuccess === "unbanned" && "User Unbanned"}
        </span>
      </div>
    )
  }

  if (showBanDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Ban User: {userName}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Email:</span> {userEmail}
          </p>
          
          <p className="text-gray-600 mb-4">
            Please provide a reason for banning this user. They will see this message when trying to log in.
          </p>
          
          <textarea
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="e.g., Fake CNIC document provided"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
            maxLength={200}
          />
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setShowBanDialog(false)
                setBanReason("")
              }}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBan}
              disabled={!banReason.trim() || isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Ban User
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show unban button for banned users
  if (isBanned) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleUnban}
          disabled={isLoading}
          className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserCheck className="h-3 w-3" />
          )}
          Unban User
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVerification("approve")}
        disabled={isLoading}
        className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
      >
        {isLoading ? (
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        Approve
      </button>
      
      <button
        onClick={() => handleVerification("reject")}
        disabled={isLoading}
        className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
      >
        {isLoading ? (
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <X className="h-3 w-3" />
        )}
        Reject
      </button>
      
      <button
        onClick={() => setShowBanDialog(true)}
        disabled={isLoading}
        className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
      >
        <Ban className="h-3 w-3" />
        Ban
      </button>
    </div>
  )
}
