// src/app/page.tsx

import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Find Your Perfect Roommate
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Roomsy.pk is a trusted platform for students and professionals in Pakistan to find safe and verified flatmates, based on location, gender, and budget.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
        <Link
          href="/listing"
          className="text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition"
        >
          Browse Listings
        </Link>
      </div>

      {/* Hero image or visual */}
        <Image
          src="/assets/roomsy-hero.png"
          alt="Roomsy flat sharing"
          width={1200}
          height={600}
          className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
          priority
        />
    </div>
  )
}
