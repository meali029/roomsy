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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
    const res = await fetch(`${baseUrl}/api/user/profile`, {
      cache: "no-store",
    })
    if (!res.ok) {
      return { message: `Profile unavailable (${res.status})` }
    }
    return res.json()
  } catch (error) {
    console.error("Profile fetch error:", error)
    return { message: "Profile unavailable" }
  }
}

async function fetchListings(): Promise<{ listings: ListingItem[] }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
    const res = await fetch(`${baseUrl}/api/listings`, {
      cache: "no-store",
    })
    if (!res.ok) return { listings: [] }
    return res.json()
  } catch (error) {
    console.error("Listings fetch error:", error)
    return { listings: [] }
  }
}

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect("/login")

    const [profileRes, listingsRes] = await Promise.all([
      fetchProfile().catch(err => {
        console.error("Profile fetch failed:", err)
        return { message: "Profile unavailable" }
      }),
      fetchListings().catch(err => {
        console.error("Listings fetch failed:", err)
        return { listings: [] }
      })
    ])

    const profile = "user" in profileRes ? profileRes.user : undefined
    const statusMsg = "message" in profileRes ? profileRes.message : undefined

    const allListings = (listingsRes?.listings || []) as ListingItem[]
    const myListings = allListings.filter((l) => l.user?.id === session.user.id).slice(0, 3)

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
                  <p className="text-sm font-medium text-rich-green/70">My Listings</p>
                  <p className="text-2xl font-bold text-rich-green">{myListings.length}</p>
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

            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="icon-circle-teal">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Location</p>
                  <p className="text-lg font-semibold text-rich-green">{profile?.city || "Not set"}</p>
                </div>
              </div>
            </div>

            <div className="card-sage p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="icon-circle-sage">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-rich-green/70">Account Type</p>
                  <p className="text-lg font-semibold text-rich-green capitalize">
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
                      <h2 className="text-xl font-semibold text-rich-green">Your Recent Listings</h2>
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
                      {myListings.map((listing) => (
                        <div key={listing.id} className="card-sage p-0 overflow-hidden">
                          <div 
                            className="h-48 bg-gradient-to-br from-mint-cream to-soft-sage/30 bg-cover bg-center"
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
                            <div className="flex space-x-2">
                              <Link 
                                href={`/listing/${listing.id}`}
                                className="flex-1 text-center px-3 py-2 text-sm font-medium text-rich-green border border-rich-green rounded-lg hover:bg-rich-green hover:text-white transition-all duration-200"
                              >
                                <Eye className="w-4 h-4 inline mr-1" />
                                View
                              </Link>
                              <Link 
                                href={`/listing/${listing.id}/edit`}
                                className="flex-1 text-center px-3 py-2 text-sm font-medium text-rich-green/70 border border-soft-sage rounded-lg hover:bg-soft-sage/20 transition-all duration-200"
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
              <div className="card-sage p-6">
                <h3 className="text-lg font-semibold text-rich-green mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Total Listings</span>
                    <span className="text-sm font-semibold text-rich-green">{myListings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Account Status</span>
                    <span className={`text-sm font-semibold ${profile?.isVerified ? 'text-rich-green' : 'text-yellow-600'}`}>
                      {profile?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Member Since</span>
                    <span className="text-sm font-semibold text-rich-green">2025</span>
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
