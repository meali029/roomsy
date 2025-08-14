"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ListingForm, { ListingFormData } from "@/components/listing/ListingForm"

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
}

export default function EditListingPage() {
  const params = useParams() as { id: string }
  const id = params.id
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`)
        if (!res.ok) throw new Error("Failed to fetch listing")
        const data = await res.json()
        const l = data.listing as Listing
        setListing(l)
  } catch {
        alert("Could not load listing")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="max-w-2xl mx-auto p-6">Loading...</div>
  if (!listing) return <div className="max-w-2xl mx-auto p-6">Listing not found</div>

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
  }

  const onSubmit = async (data: ListingFormData) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Update failed")
    }
    router.push("/dashboard/listings")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Listing</h1>
  <ListingForm defaultValues={defaults} onSubmit={onSubmit} submitLabel="Save Changes" />
    </div>
  )
}
