"use client"

import { useState, useEffect } from "react"

type UserWithDetails = {
  id: string
  name: string
  email: string
  role: string
  city: string
  isVerified: boolean
  isBanned: boolean
  createdAt: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentStatus }),
      })
      
      if (!res.ok) throw new Error("Failed to update verification status")
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: !currentStatus } : user
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleBanUser = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "unban" : "ban"
    if (!confirm(`Are you sure you want to ${action} this user?`)) return
    
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !currentStatus }),
      })
      
      if (!res.ok) throw new Error(`Failed to ${action} user`)
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBanned: !currentStatus } : user
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600">View and manage all registered users</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">{user.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isBanned
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleVerifyUser(user.id, user.isVerified)}
                      disabled={actionLoading === user.id}
                      className={`${
                        user.isVerified
                          ? "text-yellow-600 hover:text-yellow-900"
                          : "text-green-600 hover:text-green-900"
                      } disabled:opacity-50`}
                    >
                      {user.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => handleBanUser(user.id, user.isBanned)}
                      disabled={actionLoading === user.id || user.role === "ADMIN"}
                      className={`${
                        user.isBanned
                          ? "text-green-600 hover:text-green-900"
                          : "text-red-600 hover:text-red-900"
                      } disabled:opacity-50`}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found.
        </div>
      )}
    </div>
  )
}
