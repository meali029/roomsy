import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import CnicUploader from "@/components/auth/CnicUploader"

export const dynamic = "force-dynamic"

type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  city: string
  isVerified: boolean
}

type ListingItem = {
  id: string
  title: string
  city: string
  rent: number
  imageUrls: string[]
  user: { id: string; name?: string | null }
}

type ProfileResponse = { user: UserProfile } | { message: string }

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/user/profile`, {
    cache: "no-store",
  })
  if (!res.ok) {
    return { message: `Profile unavailable (${res.status})` }
  }
  return res.json()
}

async function fetchListings(): Promise<{ listings: ListingItem[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/listings`, {
    cache: "no-store",
  })
  if (!res.ok) return { listings: [] }
  return res.json()
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const [profileRes, listingsRes] = await Promise.all([fetchProfile(), fetchListings()])

  const profile = "user" in profileRes ? profileRes.user : undefined
  const statusMsg = "message" in profileRes ? profileRes.message : undefined

  const allListings = (listingsRes?.listings || []) as ListingItem[]
  const myListings = allListings.filter((l) => l.user?.id === session.user.id).slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome{profile?.name ? `, ${profile.name}` : ""}</h1>
        <p className="opacity-90 mt-1">Here’s a quick overview of your account and activity.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/listing/create" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
            + Create Listing
          </Link>
          <Link href="/dashboard/profile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
            Edit Profile
          </Link>
          <Link href="/listing" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
            Browse Listings
          </Link>
        </div>
      </div>

      {/* Status banner */}
      {statusMsg ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
          {statusMsg} – some stats may be unavailable.
        </div>
      ) : null}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="text-sm text-gray-500">My Listings</div>
          <div className="text-2xl font-bold text-gray-900">{myListings.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="text-sm text-gray-500">Verification</div>
          <div className={`text-sm mt-1 ${profile?.isVerified ? "text-green-600" : "text-yellow-600"}`}>
            {profile?.isVerified ? "✓ Verified" : "⏳ Pending / Not Verified"}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="text-sm text-gray-500">City</div>
          <div className="text-lg font-semibold text-gray-900">{profile?.city || "—"}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="text-sm text-gray-500">Role</div>
          <div className="text-lg font-semibold text-gray-900">{session.user.role || "USER"}</div>
        </div>
      </div>

      {/* Verification section */}
      {!profile?.isVerified ? (
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Verify your identity</h2>
          <p className="text-gray-600 mt-1">Upload your CNIC to get the verified badge.</p>
          <div className="mt-4">
            <CnicUploader />
          </div>
        </div>
      ) : null}

      {/* Recent listings */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your recent listings</h2>
          <Link href="/listing/create" className="text-indigo-600 hover:underline text-sm">
            Create new
          </Link>
        </div>
        {myListings.length === 0 ? (
          <p className="text-gray-600 mt-3">No listings yet. Get started by creating your first one.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {myListings.map((l) => (
              <li key={l.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-32 bg-gray-100" style={{
                  backgroundImage: `url(${l.imageUrls?.[0] || "/assets/roomsy-hero.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }} />
                <div className="p-3">
                  <div className="font-semibold text-gray-900 truncate">{l.title}</div>
                  <div className="text-sm text-gray-600">{l.city} • Rs. {l.rent?.toLocaleString?.() || l.rent}</div>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/listing/${l.id}`} className="text-indigo-600 text-sm hover:underline">View</Link>
                    <Link href={`/listing/${l.id}/edit`} className="text-gray-600 text-sm hover:underline">Edit</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
