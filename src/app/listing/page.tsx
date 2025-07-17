// src/app/listing/page.tsx

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

export default async function ListingsPage() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/listings`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error('Failed to fetch listings:', res.status, res.statusText)
      // Instead of throwing error, show empty state
      return (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              Unable to load listings. Please make sure your database is connected and the server is running.
            </p>
          </div>
        </div>
      )
    }

    const data = await res.json()
    const listings: Listing[] = data.listings || []

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
  } catch (error) {
    console.error('Error in ListingsPage:', error)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Listings</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            An error occurred while loading listings. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
