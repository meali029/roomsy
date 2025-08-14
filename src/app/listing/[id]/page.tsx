import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ListingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  // Lazy-load Prisma to avoid instantiating it during build-time module evaluation
  const { prisma } = await import("@/libs/prisma")
  const listing = await prisma.listing.findUnique({
    where: { 
      id
    },
    include: {
      user: {
        select: { id: true, name: true, city: true, gender: true, isVerified: true },
      },
    },
  })

  if (!listing) notFound()

  const images: string[] = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : ["/assets/roomsy-hero.png"]
  const location: string = listing.location || "Pakistan"

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Gallery */}
          <div className="grid grid-cols-3 gap-2">
            {images.map((src: string, i: number) => (
              <div key={i} className="relative w-full h-40 md:h-52 rounded overflow-hidden">
                <Image src={src} alt={`image-${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Info */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">Rent</div>
              <div className="text-gray-700">Rs. {listing.rent?.toLocaleString?.() || listing.rent}/month</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">Gender Preference</div>
              <div className="text-gray-700">{listing.genderPreference}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">City</div>
              <div className="text-gray-700">{listing.city}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">Exact Location</div>
              <div className="text-gray-700">{location}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">Available From</div>
              <div className="text-gray-700">{new Date(listing.availableFrom).toLocaleDateString()}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-800">Available Months</div>
              <div className="text-gray-700">{listing.availableMonths}</div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow">
              <iframe
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
              />
            </div>
          </div>
        </div>

        {/* Owner card */}
        <aside className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold text-gray-900 mb-2">Owner</div>
            <div className="flex items-center gap-2 text-gray-800">
              <span>{listing.user?.name || "Unknown"}</span>
              {listing.user?.isVerified ? (
                <span className="text-green-600 text-xs">✓ Verified</span>
              ) : null}
            </div>
            <div className="text-sm text-gray-600">{listing.user?.city || ""}</div>
            <div className="mt-4">
              <Link href={`/listing/${id}/edit`} className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg">
                Edit Listing
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
