// src/components/listing/ListingCard.tsx

import Link from "next/link"
import Image from "next/image"

interface ListingCardProps {
  id: string
  title: string
  city: string
  rent: number
  genderPreference: string
  availableFrom: string
  imageUrl?: string
}

export default function ListingCard({
  id,
  title,
  city,
  rent,
  genderPreference,
  availableFrom,
  imageUrl,
}: ListingCardProps) {
  return (
    <Link
      href={`/listing/${id}`}
      className="card block overflow-hidden group"
    >
      <div className="relative w-full h-52 overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl || "/assets/room-placeholder.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="trust-badge text-xs">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-neutral-600 mb-3">
          <svg className="w-4 h-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">{city}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-primary-500">
            Rs. {rent.toLocaleString()}
            <span className="text-sm font-normal text-neutral-600">/month</span>
          </div>
          <div className="px-3 py-1 bg-secondary-50 text-secondary-600 rounded-full text-sm font-medium">
            {genderPreference}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-neutral-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Available from: {new Date(availableFrom).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </Link>
  )
}
