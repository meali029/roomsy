// src/app/listing/page.tsx
"use client"

import { useState, useEffect } from 'react'
import ListingCard from "@/components/listing/ListingCard"

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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
