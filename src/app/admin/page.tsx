import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

async function getAdminStats() {
  try {
    const { prisma } = await import("@/libs/prisma")
    
    const [
      totalUsers,
      totalListings,
      totalReviews,
      pendingVerifications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.review.count(),
      prisma.verificationRequest.count({ where: { status: "PENDING" } }),
    ])

    return {
      totalUsers,
      totalListings,
      totalReviews,
      pendingVerifications,
    }
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      err.code === "P1001" ||
      /Can't reach database server/i.test(err.message || "")
    ) {
      return {
        totalUsers: 0,
        totalListings: 0,
        totalReviews: 0,
        pendingVerifications: 0,
        error: "Database unavailable",
      }
    }
    throw error
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the Roomsy Admin Dashboard</p>
      </div>

      {stats.error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
          {stats.error} – stats may be unavailable.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Verifications</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.pendingVerifications}</p>
          <p className="text-sm text-gray-600 mt-1">User verifications awaiting review</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Manage Users
          </a>
          <a
            href="/admin/listings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Review Listings
          </a>
          <a
            href="/admin/reviews"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Moderate Reviews
          </a>
          <a
            href="/admin/verifications"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Handle Verifications
          </a>
        </div>
      </div>
    </div>
  )
}
