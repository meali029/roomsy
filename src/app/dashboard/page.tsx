import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import CnicUploader from "@/components/auth/CnicUploader"
import { 
  Home, 
  Plus, 
  User, 
  Eye, 
  CheckCircle, 
  Clock, 
  MapPin, 
  DollarSign,
  Edit,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users
} from "lucide-react"

export const dynamic = "force-dynamic"

// Helper function to get status display info
function getStatusInfo(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Approved',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        icon: CheckCircle
      }
    case 'PENDING':
      return {
        label: 'Pending Review',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        icon: Clock
      }
    case 'REJECTED':
      return {
        label: 'Rejected',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        icon: AlertTriangle
      }
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        icon: AlertTriangle
      }
  }
}

type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  city: string
  isVerified: boolean
}

type ListingItem = {
  id: string
  title: string
  city: string
  rent: number
  imageUrls: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedAt: Date | null
  rejectedAt: Date | null
  rejectionReason: string | null
  user: { id: string; name?: string | null }
}

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect("/login")

    // Use session data for profile instead of API call
    const profile: UserProfile = {
      id: session.user.id,
      name: session.user.name || "User",
      email: session.user.email || "",
      role: session.user.role || "USER",
      city: "Not set",
      isVerified: false
    }

    // Fetch user details from database directly
    try {
      const userFromDb = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          city: true,
          isVerified: true,
        },
      })
      if (userFromDb) {
        profile.city = userFromDb.city || "Not set"
        profile.isVerified = userFromDb.isVerified
      }
    } catch (dbError) {
      console.error("Database query error:", dbError)
      // Continue with session data
    }

    // Get listings with simplified approach
    let allListings: ListingItem[] = []
    try {
      const listings = await prisma.listing.findMany({
        select: {
          id: true,
          title: true,
          city: true,
          rent: true,
          imageUrls: true,
          status: true,
          approvedAt: true,
          rejectedAt: true,
          rejectionReason: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      allListings = listings as ListingItem[]
    } catch (dbError) {
      console.error("Listings query error:", dbError)
      // Continue with empty array
    }

    const statusMsg: string | undefined = undefined
    const myListings = allListings.filter((l) => l.user?.id === session.user.id).slice(0, 3)
    
    // Calculate status counts for stats
    const allMyListings = allListings.filter((l) => l.user?.id === session.user.id)
    const statusCounts = allMyListings.reduce((acc, listing) => {
      acc[listing.status] = (acc[listing.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return (
      <div className="min-h-screen bg-mint-cream/30">
        <div className="max-w-7xl mx-auto container-spacing py-8">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-rich-green via-forest-teal to-deep-teal text-white rounded-2xl p-8 shadow-deep-teal mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ""}! 
                </h1>
                <p className="text-mint-cream/90 text-lg">
                  Manage your listings and connect with roommates
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {profile?.isVerified ? (
                  <div className="flex items-center bg-soft-sage/20 text-mint-cream px-4 py-2 rounded-full border border-soft-sage/30">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-yellow-500/20 text-yellow-100 px-4 py-2 rounded-full border border-yellow-400/30">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">Pending Verification</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link 
                href="/listing/create" 
                className="glass-mint hover:bg-white/20 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Listing</span>
              </Link>
              <Link 
                href="/dashboard/profile" 
                className="glass-mint hover:bg-white/20 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105"
              >
                <User className="w-5 h-5" />
                <span>Edit Profile</span>
              </Link>
              <Link 
                href="/listing" 
                className="glass-mint hover:bg-white/20 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105"
              >
                <Eye className="w-5 h-5" />
                <span>Browse Listings</span>
              </Link>
            </div>
          </div>

          {/* Status Notifications */}
          {statusCounts.REJECTED > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg shadow-soft">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {statusCounts.REJECTED} listing{statusCounts.REJECTED > 1 ? 's' : ''} rejected
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Please review the rejection reasons and update your listings accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {statusCounts.PENDING > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-soft">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    {statusCounts.PENDING} listing{statusCounts.PENDING > 1 ? 's' : ''} pending review
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your listings are being reviewed. This typically takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Banner */}
          {statusMsg && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-soft">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {statusMsg} – Some stats may be temporarily unavailable.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="icon-circle-sage">
                    <Home className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Total Listings</p>
                  <p className="text-2xl font-bold text-rich-green">{allMyListings.length}</p>
                </div>
              </div>
            </div>

            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shadow-soft">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.APPROVED || 0}</p>
                </div>
              </div>
            </div>

            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shadow-soft">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING || 0}</p>
                </div>
              </div>
            </div>

            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-soft ${
                    profile?.isVerified ? 'bg-soft-sage/30 text-rich-green' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {profile?.isVerified ? (
                      <Shield className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Verification</p>
                  <p className={`text-sm font-semibold ${
                    profile?.isVerified ? 'text-rich-green' : 'text-yellow-600'
                  }`}>
                    {profile?.isVerified ? '✓ Verified' : 'Pending Review'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Verification Section */}
              {!profile?.isVerified && (
                <div className="card-mint p-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-rich-green to-forest-teal px-6 py-4">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-white mr-3" />
                      <h2 className="text-xl font-semibold text-white">Complete Your Verification</h2>
                    </div>
                    <p className="text-mint-cream/90 mt-1">
                      Get verified to increase trust and unlock premium features
                    </p>
                  </div>
                  <div className="p-6 bg-white">
                    <CnicUploader />
                  </div>
                </div>
              )}

              {/* My Listings */}
              <div className="card-mint p-0 overflow-hidden">
                <div className="px-6 py-4 bg-white border-b border-soft-sage/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="w-5 h-5 text-rich-green mr-2" />
                      <div>
                        <h2 className="text-xl font-semibold text-rich-green">Your Recent Listings</h2>
                        {allMyListings.length > 0 && (
                          <p className="text-sm text-rich-green/60 mt-1">
                            {statusCounts.APPROVED || 0} approved • {statusCounts.PENDING || 0} pending • {statusCounts.REJECTED || 0} rejected
                          </p>
                        )}
                      </div>
                    </div>
                    <Link 
                      href="/listing/create" 
                      className="text-rich-green hover:text-forest-teal text-sm font-medium flex items-center transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create New
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  {myListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="w-16 h-16 text-soft-sage mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-rich-green mb-2">No listings yet</h3>
                      <p className="text-rich-green/70 mb-6">
                        Start by creating your first listing to connect with potential roommates
                      </p>
                      <Link
                        href="/listing/create"
                        className="btn-rich inline-flex items-center"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Listing
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myListings.map((listing) => {
                        const statusInfo = getStatusInfo(listing.status)
                        const StatusIcon = statusInfo.icon
                        
                        return (
                          <div key={listing.id} className="card-sage p-0 overflow-hidden">
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </div>
                            </div>
                            
                            <div 
                              className="h-48 bg-gradient-to-br from-mint-cream to-soft-sage/30 bg-cover bg-center relative"
                              style={{
                                backgroundImage: `url(${listing.imageUrls?.[0] || "/assets/room-placeholder.jpg"})`,
                              }}
                            />
                            <div className="p-4 bg-white">
                              <h3 className="font-semibold text-rich-green mb-2 line-clamp-1">
                                {listing.title}
                              </h3>
                              <div className="flex items-center text-rich-green/70 text-sm mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{listing.city}</span>
                              </div>
                              <div className="flex items-center text-rich-green font-semibold mb-4">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span>Rs. {listing.rent?.toLocaleString?.() || listing.rent}/month</span>
                              </div>
                              
                              {/* Status Message */}
                              {listing.status === 'REJECTED' && listing.rejectionReason && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm text-red-600">
                                    <strong>Rejection Reason:</strong> {listing.rejectionReason}
                                  </p>
                                </div>
                              )}
                              
                              {listing.status === 'PENDING' && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <p className="text-sm text-yellow-600">
                                    Your listing is under review. We&apos;ll notify you once it&apos;s approved.
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/listing/${listing.id}`}
                                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-rich-green border border-rich-green rounded-lg hover:bg-rich-green hover:text-white transition-all duration-200"
                                >
                                  <Eye className="w-4 h-4 inline mr-1" />
                                  View
                                </Link>
                                {listing.status !== 'REJECTED' && (
                                  <Link 
                                    href={`/listing/${listing.id}/edit`}
                                    className="flex-1 text-center px-3 py-2 text-sm font-medium text-rich-green/70 border border-soft-sage rounded-lg hover:bg-soft-sage/20 transition-all duration-200"
                                  >
                                    <Edit className="w-4 h-4 inline mr-1" />
                                    Edit
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="card-sage p-6">
                <h3 className="text-lg font-semibold text-rich-green mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Listing Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Approved
                    </span>
                    <span className="text-sm font-semibold text-green-600">{statusCounts.APPROVED || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70 flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      Pending
                    </span>
                    <span className="text-sm font-semibold text-yellow-600">{statusCounts.PENDING || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70 flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Rejected
                    </span>
                    <span className="text-sm font-semibold text-red-600">{statusCounts.REJECTED || 0}</span>
                  </div>
                  <div className="border-t border-soft-sage/20 pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-rich-green">Total</span>
                      <span className="text-sm font-bold text-rich-green">{allMyListings.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="card-sage p-6">
                <h3 className="text-lg font-semibold text-rich-green mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Platform Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Total Listings</span>
                    <span className="text-sm font-semibold text-rich-green">{allListings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Active Users</span>
                    <span className="text-sm font-semibold text-rich-green">10,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Cities Covered</span>
                    <span className="text-sm font-semibold text-rich-green">20+</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-sage p-6">
                <h3 className="text-lg font-semibold text-rich-green mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/listing/create"
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-rich-green bg-soft-sage/10 rounded-lg hover:bg-soft-sage/20 transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    Create New Listing
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-rich-green bg-soft-sage/10 rounded-lg hover:bg-soft-sage/20 transition-all duration-200 hover:scale-105"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Update Profile
                  </Link>
                  <Link
                    href="/listing"
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-rich-green bg-soft-sage/10 rounded-lg hover:bg-soft-sage/20 transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="w-4 h-4 mr-3" />
                    Browse All Listings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard page error:", error)
    return (
      <div className="min-h-screen bg-mint-cream/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rich-green mb-2">Something went wrong</h1>
          <p className="text-rich-green/70 mb-4">We&apos;re having trouble loading your dashboard.</p>
          <Link href="/login" className="btn-rich">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }
}
