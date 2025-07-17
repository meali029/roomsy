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
      className="block rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative w-full h-48">
        <Image
          src={imageUrl || "/assets/roomsy-hero.png"}
          alt="Listing"
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{city}</p>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Rs. {rent}/month</span>
          <span>{genderPreference}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Available from: {new Date(availableFrom).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
