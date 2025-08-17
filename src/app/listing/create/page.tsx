"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ListingForm, { type ListingFormData } from "@/components/listing/ListingForm"
import { Plus, CheckCircle, AlertCircle, ArrowRight, Users, Shield, Camera, MapPin, Clock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function CreateListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-cream via-white to-soft-sage/20 flex items-center justify-center">
        <div className="glass-mint p-8 rounded-2xl text-center max-w-md">
          <div className="animate-spin w-12 h-12 border-4 border-rich-green border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-rich-green mb-2">Setting up your workspace</h2>
          <p className="text-rich-green/80">Please wait while we prepare everything for you...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized state
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-cream via-white to-soft-sage/20 flex items-center justify-center">
        <div className="glass-mint p-8 rounded-2xl text-center max-w-md">
          <Shield className="w-16 h-16 text-rich-green mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-rich-green mb-3">Authentication Required</h2>
          <p className="text-rich-green/80 mb-6">You need to be logged in to create a listing. Join thousands of users finding their perfect roommates!</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push("/login")}
              className="btn-primary w-full"
            >
              Sign In to Continue
            </button>
            <button 
              onClick={() => router.push("/register")}
              className="btn-secondary w-full"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success message
  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-cream via-white to-soft-sage/20 flex items-center justify-center">
        <div className="glass-mint p-8 rounded-2xl text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-rich-green mb-3">Listing Submitted Successfully!</h2>
          <p className="text-rich-green/80 mb-6">Your listing has been submitted for review. It will go live within 24 hours after admin approval. You can track the status from your dashboard.</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full"
            >
              View My Dashboard
            </button>
            <button 
              onClick={() => router.push("/listing")}
              className="btn-secondary w-full"
            >
              Browse All Listings
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        // Show success message for 2 seconds, then redirect
        setShowSuccessMessage(true)
        setTimeout(() => {
          router.push("/dashboard?created=true")
        }, 2000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create listing")
      }
    } catch (error) {
      console.error("Error creating listing:", error)
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
                ←
              </button>
              <div>
                <h1 className="text-3xl font-bold text-rich-green flex items-center">
                  <Plus className="w-8 h-8 mr-3" />
                  Create New Listing
                </h1>
                <p className="text-rich-green/70 mt-1">
                  Share your space and find the perfect roommate
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-rich-green/70">
                Signed in as <span className="font-medium">{session.user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-rich-green/10">
        <div className="max-w-7xl mx-auto container-spacing py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3 bg-white/80 p-4 rounded-xl border border-rich-green/10">
              <Camera className="w-6 h-6 text-rich-green mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rich-green mb-1">Great Photos</h3>
                <p className="text-sm text-rich-green/70">Upload clear, well-lit photos to attract more inquiries</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/80 p-4 rounded-xl border border-rich-green/10">
              <Users className="w-6 h-6 text-rich-green mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rich-green mb-1">Detailed Description</h3>
                <p className="text-sm text-rich-green/70">Describe your space and ideal roommate preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/80 p-4 rounded-xl border border-rich-green/10">
              <MapPin className="w-6 h-6 text-rich-green mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rich-green mb-1">Accurate Location</h3>
                <p className="text-sm text-rich-green/70">Provide precise location details for better matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container-spacing py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-rich-green">Complete Your Listing</h2>
            <div className="flex items-center space-x-2 text-sm text-rich-green/70">
              <AlertCircle className="w-4 h-4" />
              <span>All required fields marked with *</span>
            </div>
          </div>
          <div className="bg-white/80 border border-rich-green/20 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-rich-green font-medium">Your listing will be reviewed and go live within 24 hours</span>
              </div>
              <ArrowRight className="w-5 h-5 text-rich-green/50" />
            </div>
          </div>
        </div>

        <ListingForm 
          onSubmit={handleSubmit}
          submitLabel={isSubmitting ? "Creating Listing..." : "🏠 Create Listing"}
        />
      </div>
    </div>
  )
}
