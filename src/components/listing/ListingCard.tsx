// src/components/listing/ListingCard.tsx

import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, Users, Shield, Heart, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react"

interface ListingCardProps {
  id: string
  title: string
  city: string
  rent: number
  genderPreference: string
  availableFrom: string
  imageUrl?: string
  status?: "PENDING" | "APPROVED" | "REJECTED"
  showStatus?: boolean // New prop to control status display
  ownerId?: string // Add owner ID for contact functionality
}

export default function ListingCard({
  id,
  title,
  city,
  rent,
  genderPreference,
  availableFrom,
  imageUrl,
  status = "APPROVED",
  showStatus = false,
  ownerId,
}: ListingCardProps) {
  const getStatusBadge = () => {
    if (!showStatus) return null

    switch (status) {
      case "PENDING":
        return (
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
              <Clock className="w-3 h-3 mr-1" />
              Pending Review
            </div>
          </div>
        )
      case "APPROVED":
        return (
          <div className="absolute top-4 left-4">
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
              <CheckCircle className="w-3 h-3 mr-1" />
              Approved
            </div>
          </div>
        )
      case "REJECTED":
        return (
          <div className="absolute top-4 left-4">
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
              <XCircle className="w-3 h-3 mr-1" />
              Rejected
            </div>
          </div>
        )
      default:
        return null
    }
  }
  return (
    <Link
      href={`/listing/${id}`}
      className="group block"
    >
      <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
        {/* Image Section */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={imageUrl || "/assets/room-placeholder.jpg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Top Left Status Badge (if showing status) */}
          {getStatusBadge()}
          
          {/* Top Right Badge */}
          <div className="absolute top-4 right-4">
            <div className="glass-mint px-3 py-1 rounded-full flex items-center text-rich-green text-xs font-medium">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </div>
          </div>
          
          {/* Heart Icon (only show if not showing status or if status is approved) */}
          {(!showStatus || status === "APPROVED") && (
            <div className="absolute top-4 left-4">
              <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rich-green hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Bottom Price Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-rich-green text-white px-4 py-2 rounded-xl">
              <div className="text-lg font-bold">Rs. {rent.toLocaleString()}</div>
              <div className="text-xs opacity-90">per month</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-rich-green mb-3 group-hover:text-forest-teal transition-colors line-clamp-2">
            {title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-rich-green/70 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-soft-sage" />
            <span className="text-sm font-medium">{city}</span>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Gender Preference */}
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-soft-sage" />
              <div>
                <div className="text-xs text-rich-green/60 uppercase tracking-wide">Preference</div>
                <div className="text-sm font-medium text-rich-green">{genderPreference}</div>
              </div>
            </div>
            
            {/* Available Date */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-soft-sage" />
              <div>
                <div className="text-xs text-rich-green/60 uppercase tracking-wide">Available</div>
                <div className="text-sm font-medium text-rich-green">
                  {new Date(availableFrom).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="pt-4 border-t border-rich-green/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-rich-green/70">View Details</span>
              <div className="flex items-center space-x-2">
                {ownerId && (
                  <Link
                    href={`/chat?partner=${ownerId}&listing=${id}`}
                    className="p-2 bg-rich-green/10 rounded-full text-rich-green hover:bg-rich-green hover:text-white transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                )}
                <div className="w-8 h-8 bg-rich-green/10 rounded-full flex items-center justify-center group-hover:bg-rich-green group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
