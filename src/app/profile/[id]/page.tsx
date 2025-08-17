import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  Phone, 
  CheckCircle,
  MessageCircle,
  Home,
  Clock,
  Award
} from "lucide-react"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const session = await getServerSession(authOptions)

  // Lazy-load Prisma
  const { prisma } = await import("@/libs/prisma")
  
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      city: true,
      gender: true,
      isVerified: true,
      profession: true,
      university: true,
      createdAt: true,
      listings: {
        select: {
          id: true,
          title: true,
          rent: true,
          city: true,
          imageUrls: true,
          availableFrom: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) notFound()

  const isOwnProfile = session?.user?.email === user.email
  const memberSince = new Date(user.createdAt).getFullYear()
  const activeListings = user.listings.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
      {/* Header Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rich-green/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto container-spacing py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/listing" 
              className="flex items-center space-x-2 text-rich-green hover:text-rich-green/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Listings</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              {!isOwnProfile && (
                <button className="flex items-center space-x-2 bg-rich-green text-white px-4 py-2 rounded-lg font-medium hover:bg-rich-green/90 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto container-spacing py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-rich-green to-soft-sage rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-rich-green">{user.name || "Unknown User"}</h1>
                  {user.isVerified && (
                    <Shield className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-rich-green/70">{user.city || "Pakistan"}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 rounded-xl">
                  <div className="text-2xl font-bold text-rich-green">{activeListings}</div>
                  <div className="text-sm text-rich-green/70">Active Listings</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 rounded-xl">
                  <div className="text-2xl font-bold text-rich-green">{memberSince}</div>
                  <div className="text-sm text-rich-green/70">Member Since</div>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                {user.profession && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-rich-green" />
                    </div>
                    <div>
                      <div className="font-medium text-rich-green">Profession</div>
                      <div className="text-sm text-rich-green/70">{user.profession}</div>
                    </div>
                  </div>
                )}
                
                {user.university && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                      🎓
                    </div>
                    <div>
                      <div className="font-medium text-rich-green">University</div>
                      <div className="text-sm text-rich-green/70">{user.university}</div>
                    </div>
                  </div>
                )}

                {user.gender && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-rich-green" />
                    </div>
                    <div>
                      <div className="font-medium text-rich-green">Gender</div>
                      <div className="text-sm text-rich-green/70">{user.gender}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-rich-green" />
                  </div>
                  <div>
                    <div className="font-medium text-rich-green">Joined</div>
                    <div className="text-sm text-rich-green/70">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              {user.isVerified && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Verified Member</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    This user has completed identity verification
                  </p>
                </div>
              )}

              {/* Contact Actions */}
              {!isOwnProfile && (
                <div className="mt-6 space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-rich-green text-white px-6 py-3 rounded-xl font-medium hover:bg-rich-green/90 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-rich-green text-rich-green px-6 py-3 rounded-xl font-medium hover:bg-rich-green/5 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Request Contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-rich-green mb-6 flex items-center">
                <Home className="w-6 h-6 mr-3" />
                {isOwnProfile ? 'My Listings' : 'User Listings'} ({activeListings})
              </h2>

              {user.listings.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-rich-green/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-rich-green/70 mb-2">
                    {isOwnProfile ? 'No listings yet' : 'No active listings'}
                  </h3>
                  <p className="text-rich-green/50 mb-6">
                    {isOwnProfile 
                      ? 'Start by creating your first room listing'
                      : 'This user doesn\'t have any active listings at the moment'
                    }
                  </p>
                  {isOwnProfile && (
                    <Link 
                      href="/listing/create"
                      className="inline-flex items-center space-x-2 bg-rich-green text-white px-6 py-3 rounded-xl font-medium hover:bg-rich-green/90 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span>Create Listing</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.listings.map((listing) => (
                    <Link 
                      key={listing.id}
                      href={`/listing/${listing.id}`}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-mint-cream/30 to-soft-sage/20 border border-rich-green/20 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-48">
                          <Image
                            src={listing.imageUrls?.[0] || "/assets/roomsy-hero.png"}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-rich-green text-white px-2 py-1 rounded-full text-xs font-medium">
                              Rs. {listing.rent?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-rich-green mb-2 group-hover:text-rich-green/80 transition-colors">
                            {listing.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-rich-green/70">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{listing.city}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
