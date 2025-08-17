"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ListingForm, { ListingFormData } from "@/components/listing/ListingForm"
import { ArrowLeft, Edit3, Shield, AlertTriangle } from "lucide-react"

interface Listing {
  id: string
  title: string
  description: string
  rent: number
  city: string
  location: string | null
  genderPreference: string
  availableFrom: string
  availableMonths: number
  imageUrls: string[]
  user?: {
    id: string
    email: string
    name?: string
  }
}

export default function EditListingPage() {
  const params = useParams() as { id: string }
  const id = params.id
  const router = useRouter()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(false)
        
        const res = await fetch(`/api/listings/${id}`)
        if (!res.ok) throw new Error("Failed to fetch listing")
        
        const data = await res.json()
        const listingData = data.listing || data
        
        // Check if current user is the owner
        if (listingData.user?.email !== session.user?.email) {
          router.push(`/listing/${id}`) // Redirect to view page if not owner
          return
        }
        
        setListing(listingData)
      } catch (err) {
        console.error("Could not load listing:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      load()
    }
  }, [id, session, status, router])

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-rich-green/20 rounded-2xl p-8 text-center max-w-md">
          <div className="animate-spin w-12 h-12 border-4 border-rich-green border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-rich-green mb-2">Loading listing...</h2>
          <p className="text-rich-green/80">Please wait while we fetch your listing details</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-rich-green/20 rounded-2xl p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-rich-green mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-rich-green mb-3">Authentication Required</h2>
          <p className="text-rich-green/80 mb-6">You need to be logged in to edit a listing.</p>
          <button 
            onClick={() => router.push("/login")}
            className="btn-primary w-full"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  // Error or not found
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-rich-green/20 rounded-2xl p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-rich-green mb-3">Listing Not Found</h2>
          <p className="text-rich-green/80 mb-6">Sorry, we couldn&apos;t find this listing or you don&apos;t have permission to edit it.</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push("/listing")}
              className="btn-primary w-full"
            >
              Browse All Listings
            </button>
            <button 
              onClick={() => router.back()}
              className="btn-secondary w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const defaults: ListingFormData = {
    title: listing.title,
    description: listing.description,
    rent: String(listing.rent),
    city: listing.city,
    location: listing.location || "",
    genderPreference: listing.genderPreference,
    availableFrom: listing.availableFrom?.slice(0, 10),
    availableMonths: listing.availableMonths,
    imageUrls: listing.imageUrls || [],
    roomType: "",
    propertyType: "",
    amenities: [],
    university: "",
    profession: ""
  }

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Update failed")
      }
      
      router.push(`/listing/${id}?updated=true`)
    } catch (error) {
      console.error("Update error:", error)
      alert(error instanceof Error ? error.message : "Network error. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-rich-green/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto container-spacing py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-lg bg-white/80 text-rich-green hover:scale-110 transition-transform border border-rich-green/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-rich-green flex items-center">
                  <Edit3 className="w-8 h-8 mr-3" />
                  Edit Listing
                </h1>
                <p className="text-rich-green/70 mt-1">
                  Update your listing details and attract more roommates
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-rich-green/70">
                Editing as <span className="font-medium">{session.user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container-spacing py-12">
        <div className="mb-8">
          <div className="bg-white/80 border border-rich-green/20 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-rich-green" />
              <span className="text-rich-green font-medium">
                Make changes to your listing below. All updates will be reviewed before going live.
              </span>
            </div>
          </div>
        </div>

        <ListingForm 
          defaultValues={defaults} 
          onSubmit={onSubmit} 
          submitLabel={isSubmitting ? "Updating Listing..." : "💾 Update Listing"}
        />
      </div>
    </div>
  )
}
