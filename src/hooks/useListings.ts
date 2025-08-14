// src/hooks/useListings.ts

import { useState, useEffect, useCallback } from 'react'

export interface Listing {
  id: number
  title: string
  description: string
  rent: number
  city: string
  location: string
  genderPreference: string
  availableFrom: string
  availableMonths: number
  imageUrls: string[]
  createdAt: string
  updatedAt: string
  userId: string
  user: {
    id: string
    name: string
    city: string
    gender: string
    isVerified: boolean
  }
}

interface UseListingsReturn {
  listings: Listing[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useListings(limit?: number): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/listings')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Apply limit if specified
      const allListings = data.listings || []
      const limitedListings = limit ? allListings.slice(0, limit) : allListings
      
      setListings(limitedListings)
    } catch (err) {
      console.error('Error fetching listings:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch listings')
      // Set empty array on error so UI doesn't break
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return {
    listings,
    loading,
    error,
    refetch: fetchListings
  }
}
