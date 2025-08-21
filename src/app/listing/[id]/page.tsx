"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Edit3, 
  Shield, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  Flag,
  Clock,
  Home,
  CheckCircle,
  AlertCircle,
  User,
  MessageCircle,
  Camera
} from "lucide-react"

export const dynamic = "force-dynamic"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<{
    id: string
    title: string
    description: string
    rent: number
    city: string
    location: string
    genderPreference: string
    availableFrom: string
    availableMonths: number
    imageUrls: string[]
    user: {
      id: string
      name: string
      email: string
      city?: string
      gender?: string
      isVerified?: boolean
      profession?: string
      university?: string
      createdAt: string
    }
    createdAt: string
    updatedAt: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const id = params?.id as string

  useEffect(() => {
    if (!id) return

    const fetchListing = async () => {
      try {
        setLoading(true)
        setError(false)
        
        // Add proper headers to handle caching
        const response = await fetch(`/api/listings/${id}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        // Handle both 200 (OK) and 304 (Not Modified) as success
        if (response.ok || response.status === 304) {
          const data = await response.json()
          
          // Check if we received the listing data correctly
          if (data && data.listing) {
            setListing(data.listing)
          } else if (data && data.id) {
            // Handle case where data structure is different
            setListing(data)
          } else {
            console.error('Unexpected data structure:', data)
            setError(true)
          }
        } else {
          console.error(`HTTP ${response.status}: ${response.statusText}`)
          setError(true)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-rich-green/20 rounded-2xl p-6 md:p-8 text-center max-w-sm md:max-w-md w-full">
          <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-rich-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg md:text-xl font-bold text-rich-green mb-2">Loading listing details...</h2>
          <p className="text-rich-green/70 text-sm md:text-base">Please wait while we fetch the information</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-rich-green/20 rounded-2xl p-6 md:p-8 text-center max-w-sm md:max-w-md w-full">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg md:text-xl font-bold text-rich-green mb-2">Listing Not Found</h2>
          <p className="text-rich-green/70 mb-6 text-sm md:text-base">Sorry, we couldn&apos;t find this listing. It may have been removed or the link is incorrect.</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/listing')}
              className="btn-primary w-full text-sm md:text-base py-2 md:py-3"
            >
              Browse All Listings
            </button>
            <button 
              onClick={() => router.back()}
              className="btn-secondary w-full text-sm md:text-base py-2 md:py-3"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Process and validate images
  const rawImages = listing.imageUrls || []
  const validImages = rawImages.filter((url: string) => url && url.trim() !== '')
  const images: string[] = validImages.length > 0 ? validImages : ["/assets/room-placeholder.jpg"]
  
  const location: string = listing.location || "Pakistan"
  
  // Check if current user is the owner of this listing
  const isOwner = session?.user?.email === listing.user?.email
  
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
      {/* Header Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rich-green/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto container-spacing py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/listing" 
              className="flex items-center space-x-2 text-rich-green hover:text-rich-green/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">Back to Listings</span>
            </Link>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <button className="p-1.5 md:p-2 rounded-lg bg-white/80 text-rich-green hover:scale-110 transition-transform border border-rich-green/10">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="p-1.5 md:p-2 rounded-lg bg-white/80 text-rich-green hover:scale-110 transition-transform border border-rich-green/10">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="p-1.5 md:p-2 rounded-lg bg-white/80 text-rich-green hover:scale-110 transition-transform border border-rich-green/10">
                <Flag className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-spacing py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Image Gallery */}
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg overflow-hidden">
              {images && images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative h-80 md:h-96">
                    <Image 
                      src={images[0]} 
                      alt={`${listing.title} - Main image`}
                      fill 
                      className="object-cover"
                      priority
                      unoptimized={images[0].includes('cloudinary')}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/room-placeholder.jpg'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-rich-green text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {images.length} Photo{images.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Additional Images */}
                  {images.length > 1 && (
                    <div className="p-3 md:p-4">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2">
                        {images.slice(1, 5).map((src: string, i: number) => (
                          <div key={i + 1} className="relative h-16 sm:h-20 md:h-24 overflow-hidden rounded-lg">
                            <Image 
                              src={src} 
                              alt={`${listing.title} - Image ${i + 2}`} 
                              fill 
                              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" 
                              unoptimized={src.includes('cloudinary')}
                              onError={(e) => {
                                e.currentTarget.src = '/assets/room-placeholder.jpg'
                              }}
                            />
                          </div>
                        ))}
                        {images.length > 5 && (
                          <div className="relative h-16 sm:h-20 md:h-24 bg-rich-green/10 rounded-lg flex items-center justify-center">
                            <span className="text-rich-green font-medium text-xs sm:text-sm">
                              +{images.length - 5} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative h-80 bg-gradient-to-br from-rich-green/5 to-soft-sage/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-rich-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-rich-green/60" />
                    </div>
                    <p className="text-rich-green/60 font-medium">No images available</p>
                    <p className="text-rich-green/40 text-sm">Images will be displayed here when uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-rich-green mb-2">{listing.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-rich-green/70">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{listing.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Available from {new Date(listing.availableFrom).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl md:text-3xl font-bold text-rich-green">
                    Rs. {listing.rent?.toLocaleString?.() || listing.rent}
                  </div>
                  <div className="text-sm text-rich-green/70">per month</div>
                </div>
              </div>

              <div className="prose prose-rich-green max-w-none mb-6 md:mb-8">
                <p className="text-rich-green/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {listing.description}
                </p>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 rounded-xl">
                  <Home className="w-6 md:w-8 h-6 md:h-8 text-rich-green mx-auto mb-2" />
                  <div className="font-semibold text-rich-green text-sm">Rent</div>
                  <div className="text-rich-green/70 text-xs">Rs. {listing.rent?.toLocaleString()}/month</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 rounded-xl">
                  <Users className="w-6 md:w-8 h-6 md:h-8 text-rich-green mx-auto mb-2" />
                  <div className="font-semibold text-rich-green text-sm">Gender Pref.</div>
                  <div className="text-rich-green/70 text-xs">{listing.genderPreference}</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 rounded-xl sm:col-span-2 md:col-span-1">
                  <Clock className="w-6 md:w-8 h-6 md:h-8 text-rich-green mx-auto mb-2" />
                  <div className="font-semibold text-rich-green text-sm">Duration</div>
                  <div className="text-rich-green/70 text-xs">{listing.availableMonths} months</div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-bold text-rich-green mb-4 flex items-center text-lg md:text-xl">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </h3>
                <div className="bg-gradient-to-r from-rich-green/5 to-soft-sage/10 p-3 md:p-4 rounded-xl border border-rich-green/20 mb-4">
                  <p className="text-rich-green/80 text-sm md:text-base">{location}</p>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                  <iframe
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Owner Profile Card */}
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-4 md:p-6">
              <h3 className="font-bold text-rich-green mb-4 flex items-center text-lg md:text-xl">
                <User className="w-5 h-5 mr-2" />
                Property Owner
              </h3>
              
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-rich-green to-soft-sage rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold">
                  {listing.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-rich-green text-sm md:text-base truncate">{listing.user?.name || "Unknown"}</h4>
                    {listing.user?.isVerified && (
                      <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-rich-green/70 truncate">{listing.user?.city || ""}</p>
                  {listing.user?.profession && (
                    <p className="text-xs text-rich-green/60 truncate">{listing.user.profession}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4 md:mb-6">
                {listing.user?.university && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-8 h-8 bg-mint-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      🎓
                    </div>
                    <span className="text-rich-green/80 truncate">{listing.user.university}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 bg-mint-cream rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-rich-green" />
                  </div>
                  <span className="text-rich-green/80">
                    Member since {new Date(listing.user?.createdAt || '').getFullYear()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwner ? (
                  <Link 
                    href={`/listing/${id}/edit`} 
                    className="flex items-center justify-center space-x-2 bg-rich-green text-white px-4 md:px-6 py-3 rounded-xl font-medium hover:bg-rich-green/90 transition-colors w-full text-sm md:text-base"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Listing</span>
                  </Link>
                ) : (
                  <>
                    <Link 
                      href={`/chat?partner=${listing.user?.id}&listing=${id}`}
                      className="flex items-center justify-center space-x-2 bg-rich-green text-white px-4 md:px-6 py-3 rounded-xl font-medium hover:bg-rich-green/90 transition-colors w-full text-sm md:text-base"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact Owner</span>
                    </Link>
                    <Link 
                      href={`/profile/${listing.user?.id}`}
                      className="flex items-center justify-center space-x-2 bg-white border-2 border-rich-green text-rich-green px-4 md:px-6 py-3 rounded-xl font-medium hover:bg-rich-green/5 transition-colors w-full text-sm md:text-base"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 border border-rich-green/20 rounded-2xl shadow-lg p-4 md:p-6">
              <h3 className="font-bold text-rich-green mb-4 flex items-center text-lg md:text-xl">
                <Shield className="w-5 h-5 mr-2" />
                Safety Tips
              </h3>
              <ul className="space-y-3 text-sm text-rich-green/80">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Always meet in a public place first</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify the property and owner details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Never share personal financial information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Trust your instincts and stay safe</span>
                </li>
              </ul>
            </div>

            {/* Contact Info Card */}
            {!isOwner && (
              <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-4 md:p-6">
                <h3 className="font-bold text-rich-green mb-4 text-lg md:text-xl">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-mint-cream/50 rounded-lg">
                    <Phone className="w-5 h-5 text-rich-green flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-rich-green">Call Now</div>
                      <div className="text-xs text-rich-green/70">Available 9 AM - 9 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-mint-cream/50 rounded-lg">
                    <Mail className="w-5 h-5 text-rich-green flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-rich-green">Send Message</div>
                      <div className="text-xs text-rich-green/70">Quick response guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
