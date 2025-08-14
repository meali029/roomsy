// src/app/listing/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ListingCard from "@/components/listing/ListingCard"
import RoomsyLoader from "@/components/shared/RoomsyLoader"

interface Listing {
  id: string
  title: string
  city: string
  rent: number
  genderPreference: string
  availableFrom: string
  imageUrls: string[]
  user: {
    name: string
    city: string
    gender: string
    isVerified: boolean
  }
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListings() {
      try {
        // Fetch from real database API
        const res = await fetch('/api/listings')
        
        if (!res.ok) {
          throw new Error(`Failed to fetch listings: ${res.status}`)
        }

        const data = await res.json()
        setListings(data.listings || [])
      } catch (err) {
        console.error('Error fetching listings:', err)
        setError('Failed to load listings. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <div className="section-spacing container-spacing max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800 mb-4">
            Available Listings
          </h1>
          <p className="text-xl text-neutral-600">
            Discover your perfect roommate match
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <RoomsyLoader size="lg" text="Finding perfect roommates for you..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-spacing container-spacing max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800 mb-4">
            Available Listings
          </h1>
          <p className="text-xl text-neutral-600">
            Discover your perfect roommate match
          </p>
        </div>
        <div className="card bg-red-50 border-2 border-red-200 p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing container-spacing max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800 mb-4">
          Available Listings
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Discover your perfect roommate match from our verified community
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select className="input text-sm max-w-xs">
              <option>All Cities</option>
              <option>Karachi</option>
              <option>Lahore</option>
              <option>Islamabad</option>
            </select>
            <select className="input text-sm max-w-xs">
              <option>Any Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="input text-sm max-w-xs">
              <option>All Budgets</option>
              <option>Under 20k</option>
              <option>20k - 40k</option>
              <option>40k+</option>
            </select>
          </div>
          <div className="text-sm text-neutral-600">
            {listings.length} listings found
          </div>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-4">No listings found</h3>
          <p className="text-neutral-600 mb-8">
            Be the first to create a listing in your area!
          </p>
          <Link href="/listing/create" className="btn-primary">
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              city={listing.city}
              rent={listing.rent}
              genderPreference={listing.genderPreference}
              availableFrom={listing.availableFrom}
              imageUrl={listing.imageUrls[0]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
