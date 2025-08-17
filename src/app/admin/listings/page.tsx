"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar, Eye } from "lucide-react"

type ListingStatus = "PENDING" | "APPROVED" | "REJECTED"

type AdminListing = {
  id: string
  title: string
  description: string
  city: string
  rent: number
  status: ListingStatus
  imageUrls: string[]
  createdAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  user: {
    id: string
    name: string
    email: string
    city: string
    isVerified: boolean
  }
}

export default function AdminListingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<AdminListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<ListingStatus | "ALL">("ALL")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    // Type assertion for custom session
    const customSession = session as unknown as { user: { role: string } }
    if (customSession.user?.role !== "ADMIN") {
      router.push("/")
      return
    }
    fetchListings()
  }, [session, status, router])

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/admin/listings")
      if (!response.ok) {
        throw new Error("Failed to fetch listings")
      }
      const data = await response.json()
      setListings(data.listings || [])
    } catch (error) {
      console.error("Error fetching listings:", error)
      setError("Failed to load listings")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (listingId: string) => {
    setActionLoading(listingId)
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/approve`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to approve listing")
      }
      await fetchListings() // Refresh the list
    } catch (error) {
      console.error("Error approving listing:", error)
      alert("Failed to approve listing")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (listingId: string, reason?: string) => {
    setActionLoading(listingId)
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) {
        throw new Error("Failed to reject listing")
      }
      await fetchListings() // Refresh the list
    } catch (error) {
      console.error("Error rejecting listing:", error)
      alert("Failed to reject listing")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
    }
  }

  const filteredListings = filterStatus === "ALL" 
    ? listings 
    : listings.filter(listing => listing.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listing Management</h1>
          <p className="text-gray-600">Review and approve listings submitted by users</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ListingStatus | "ALL")}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{listings.length}</div>
          <div className="text-sm text-gray-600">Total Listings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {listings.filter(l => l.status === "PENDING").length}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {listings.filter(l => l.status === "APPROVED").length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">
            {listings.filter(l => l.status === "REJECTED").length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Listings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No listings found for the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Listing Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={listing.imageUrls[0] || "/assets/room-placeholder.jpg"}
                      alt={listing.title}
                      width={100}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Listing Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {listing.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {listing.city}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">Rs. {listing.rent.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-2 mt-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {listing.user.name} ({listing.user.email})
                          </span>
                          {listing.user.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(listing.status)}
                        
                        {/* Action Buttons */}
                        {listing.status === "PENDING" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                              {actionLoading === listing.id ? (
                                <>
                                  <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Rejection reason (optional):")
                                if (reason !== null) {
                                  handleReject(listing.id, reason)
                                }
                              }}
                              disabled={actionLoading === listing.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => window.open(`/listing/${listing.id}`, "_blank")}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                      </div>
                    </div>

                    {/* Rejection Details */}
                    {listing.status === "REJECTED" && listing.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {listing.rejectionReason}
                        </p>
                        {listing.rejectedAt && (
                          <p className="text-xs text-red-600 mt-1">
                            Rejected on {new Date(listing.rejectedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Approval Details */}
                    {listing.status === "APPROVED" && listing.approvedAt && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-green-600">
                          Approved on {new Date(listing.approvedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
