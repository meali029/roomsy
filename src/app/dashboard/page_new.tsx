import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
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
  Users,
  Star
} from "lucide-react"

export const dynamic = "force-dynamic"

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
  user: { id: string; name?: string | null }
}

type ProfileResponse = { user: UserProfile } | { message: string }

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/user/profile`, {
    cache: "no-store",
  })
  if (!res.ok) {
    return { message: `Profile unavailable (${res.status})` }
  }
  return res.json()
}

async function fetchListings(): Promise<{ listings: ListingItem[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/listings`, {
    cache: "no-store",
  })
  if (!res.ok) return { listings: [] }
  return res.json()
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const [profileRes, listingsRes] = await Promise.all([fetchProfile(), fetchListings()])

  const profile = "user" in profileRes ? profileRes.user : undefined
  const statusMsg = "message" in profileRes ? profileRes.message : undefined

  const allListings = (listingsRes?.listings || []) as ListingItem[]
  const myListings = allListings.filter((l) => l.user?.id === session.user.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ""}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Here&apos;s your dashboard overview and latest activity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {profile?.isVerified ? (
                <div className="flex items-center bg-green-500/20 text-green-100 px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center bg-yellow-500/20 text-yellow-100 px-4 py-2 rounded-full">
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
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 border border-white/20"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create Listing</span>
            </Link>
            <Link 
              href="/dashboard/profile" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 border border-white/20"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Edit Profile</span>
            </Link>
            <Link 
              href="/listing" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 border border-white/20"
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">Browse Listings</span>
            </Link>
          </div>
        </div>

        {/* Status Banner */}
        {statusMsg && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">My Listings</p>
                <p className="text-2xl font-bold text-gray-900">{myListings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  profile?.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {profile?.isVerified ? (
                    <Shield className="w-6 h-6 text-green-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Verification</p>
                <p className={`text-sm font-semibold ${
                  profile?.isVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {profile?.isVerified ? '✓ Verified' : 'Pending Review'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.city || "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {session.user.role?.toLowerCase() || "User"}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-white mr-3" />
                    <h2 className="text-xl font-semibold text-white">Complete Your Verification</h2>
                  </div>
                  <p className="text-indigo-100 mt-1">
                    Get verified to increase trust and unlock premium features
                  </p>
                </div>
                <div className="p-6">
                  <CnicUploader />
                </div>
              </div>
            )}

            {/* My Listings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-gray-400 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Your Recent Listings</h2>
                  </div>
                  <Link 
                    href="/listing/create" 
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create New
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {myListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-6">
                      Start by creating your first listing to connect with potential roommates
                    </p>
                    <Link
                      href="/listing/create"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Listing
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div 
                          className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${listing.imageUrls?.[0] || "/assets/room-placeholder.jpg"})`,
                          }}
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                            {listing.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{listing.city}</span>
                          </div>
                          <div className="flex items-center text-gray-900 font-semibold mb-4">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>Rs. {listing.rent?.toLocaleString?.() || listing.rent}/month</span>
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              href={`/listing/${listing.id}`}
                              className="flex-1 text-center px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4 inline mr-1" />
                              View
                            </Link>
                            <Link 
                              href={`/listing/${listing.id}/edit`}
                              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4 inline mr-1" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Listings</span>
                  <span className="text-sm font-semibold text-gray-900">{myListings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account Status</span>
                  <span className={`text-sm font-semibold ${profile?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {profile?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm font-semibold text-gray-900">2024</span>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Platform Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Listings</span>
                  <span className="text-sm font-semibold text-gray-900">{allListings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Active Users</span>
                  <span className="text-sm font-semibold text-gray-900">10,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Cities Covered</span>
                  <span className="text-sm font-semibold text-gray-900">20+</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/listing/create"
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-3 text-gray-400" />
                  Create New Listing
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  Update Profile
                </Link>
                <Link
                  href="/listing"
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4 mr-3 text-gray-400" />
                  Browse All Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
