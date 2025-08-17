// src/app/listing/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, DollarSign, Users, Calendar } from 'lucide-react'
import ListingCard from "@/components/listing/ListingCard"
import RoomsyLoader from "@/components/shared/RoomsyLoader"
import { popularCities } from '@/constants/cities'
import { roommatePrefGenders } from '@/constants/genders'
import { priceRanges, roomTypes, amenities, sortOptions } from '@/constants/filters'

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

interface FilterState {
  search: string
  city: string
  genderPreference: string
  priceRange: string
  roomType: string
  amenities: string[]
  sortBy: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    city: '',
    genderPreference: '',
    priceRange: '',
    roomType: '',
    amenities: [],
    sortBy: 'newest'
  })

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
        setFilteredListings(data.listings || [])
      } catch (err) {
        console.error('Error fetching listings:', err)
        setError('Failed to load listings. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Filter and sort listings whenever filters change
  useEffect(() => {
    let filtered = [...listings]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        listing.city.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(listing => 
        listing.city.toLowerCase() === filters.city.toLowerCase()
      )
    }

    // Gender preference filter
    if (filters.genderPreference && filters.genderPreference !== 'any') {
      filtered = filtered.filter(listing => 
        listing.genderPreference.toLowerCase() === filters.genderPreference.toLowerCase() ||
        listing.genderPreference.toLowerCase() === 'any'
      )
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(listing => 
        listing.rent >= min && listing.rent <= max
      )
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.rent - b.rent
        case 'price_desc':
          return b.rent - a.rent
        case 'created_asc':
          return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime()
        case 'created_desc':
        default:
          return new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime()
      }
    })

    setFilteredListings(filtered)
  }, [listings, filters])

  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAmenityToggle = (amenityValue: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityValue)
        ? prev.amenities.filter(a => a !== amenityValue)
        : [...prev.amenities, amenityValue]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      genderPreference: '',
      priceRange: '',
      roomType: '',
      amenities: [],
      sortBy: 'newest'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
        <div className="bg-gradient-to-r from-rich-green to-forest-teal text-white">
          <div className="max-w-7xl mx-auto container-spacing py-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Find Your Perfect Roommate
              </h1>
              <p className="text-xl text-mint-cream/90 max-w-3xl mx-auto">
                Discovering amazing listings across Pakistan...
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto container-spacing py-16">
          <div className="flex justify-center items-center">
            <RoomsyLoader size="lg" text="Finding perfect roommates for you..." />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
        <div className="bg-gradient-to-r from-rich-green to-forest-teal text-white">
          <div className="max-w-7xl mx-auto container-spacing py-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Find Your Perfect Roommate
              </h1>
              <p className="text-xl text-mint-cream/90 max-w-3xl mx-auto">
                Oops! Something went wrong while loading listings
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto container-spacing py-16">
          <div className="bg-white/95 backdrop-blur-sm border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Listings</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r rounded-pill from-rich-green to-forest-teal text-white">
        <div className="max-w-7xl mx-auto container-spacing py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Perfect Roommate
            </h1>
            <p className="text-xl text-mint-cream/90 max-w-3xl mx-auto mb-8">
              Browse {listings.length} verified listings from trusted members across Pakistan
            </p>
            
            {/* Hero Search */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by location, area, or university..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="input pl-12 w-full"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-4 h-4" />
                    <select 
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="input pl-10 w-full"
                    >
                      <option value="">All Cities</option>
                      {popularCities.map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-sage flex items-center justify-center gap-2"
                  >
                    <Filter className="w-4 h-4 " />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-spacing">
        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-8 mb-8 -mt-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-rich-green">Filter & Sort Results</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-rich-green/70 hover:text-rich-green transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gender Preference */}
              <div>
                <label className="block text-sm font-medium text-rich-green mb-3">
                  <Users className="w-4 h-4 inline mr-2" />
                  Gender Preference
                </label>
                <select
                  value={filters.genderPreference}
                  onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
                  className="input w-full"
                >
                  <option value="">Any Gender</option>
                  {roommatePrefGenders.map(gender => (
                    <option key={gender.id} value={gender.value}>
                      {gender.icon} {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-rich-green mb-3">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Budget Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Budgets</option>
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-rich-green mb-3">
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Types</option>
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-rich-green mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input w-full"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Popular Amenities */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-rich-green mb-4">Popular Amenities</label>
              <div className="flex flex-wrap gap-3">
                {amenities.slice(0, 8).map(amenity => (
                  <label 
                    key={amenity.id} 
                    className={`flex items-center px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                      filters.amenities.includes(String(amenity.value))
                        ? 'border-rich-green bg-rich-green text-white'
                        : 'border-rich-green/20 bg-white hover:border-rich-green/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(String(amenity.value))}
                      onChange={() => handleAmenityToggle(String(amenity.value))}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {amenity.icon} {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-rich-green">
              {filteredListings.length} Listings Found
            </h2>
            <p className="text-rich-green/70 mt-1">
              {filteredListings.length !== listings.length && `Filtered from ${listings.length} total listings`}
            </p>
          </div>
          
          <Link 
            href="/listing/create"
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Post Listing
          </Link>
        </div>

        {/* Results Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-soft-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-rich-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-rich-green mb-4">
              {listings.length === 0 ? 'No listings available yet' : 'No listings match your filters'}
            </h3>
            <p className="text-rich-green/70 mb-8 max-w-md mx-auto">
              {listings.length === 0 
                ? 'Be the first to create a listing in your area and start connecting with potential roommates!'
                : 'Try adjusting your search criteria or explore different locations.'
              }
            </p>
            {listings.length === 0 ? (
              <Link href="/listing/create" className="btn-primary">
                🏠 Create First Listing
              </Link>
            ) : (
              <button onClick={clearFilters} className="btn-secondary">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
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
    </div>
  )
}
