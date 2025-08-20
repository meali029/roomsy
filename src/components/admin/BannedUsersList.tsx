"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Ban, UserCheck, User, Mail, Calendar, AlertTriangle, FileText } from "lucide-react"

interface BannedUser {
  id: string
  name: string
  email: string
  isBanned: boolean
  banReason: string | null
  bannedAt: Date | null
  createdAt: Date
  _count: {
    listings: number
  }
}

interface BannedUsersListProps {
  initialBannedUsers: BannedUser[]
}

export default function BannedUsersList({ initialBannedUsers }: BannedUsersListProps) {
  const [bannedUsers, setBannedUsers] = useState(initialBannedUsers)
  const [, startTransition] = useTransition()
  const [isUnbanning, setIsUnbanning] = useState<string | null>(null)
  const router = useRouter()

  const handleUnban = async (userId: string) => {
    setIsUnbanning(userId)
    
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
        // Remove user from banned list immediately
        setBannedUsers(prev => prev.filter(user => user.id !== userId))
        
        // Refresh data
        startTransition(() => {
          router.refresh()
        })
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to unban user"}`)
      }
    } catch (error) {
      console.error("Unban error:", error)
      alert("Network error occurred")
    } finally {
      setIsUnbanning(null)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  if (!bannedUsers || bannedUsers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Banned Users</h3>
        <p className="text-gray-600">All users are currently in good standing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Ban className="h-5 w-5 text-red-600" />
          <span className="font-medium text-red-900">
            {bannedUsers.length} banned user{bannedUsers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {bannedUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>
                
                {/* Ban Details */}
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 mb-1">Ban Reason:</p>
                      <p className="text-sm text-red-700">{user.banReason || "No reason provided"}</p>
                    </div>
                  </div>
                </div>
                
                {/* User Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Banned: {formatDate(user.bannedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{user._count.listings} listing{user._count.listings !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined: {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleUnban(user.id)}
                  disabled={isUnbanning === user.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUnbanning === user.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  {isUnbanning === user.id ? "Unbanning..." : "Unban User"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
