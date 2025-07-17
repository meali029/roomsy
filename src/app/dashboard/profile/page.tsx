// src/app/dashboard/profile/page.tsx

import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div className="p-6 text-center">You must be logged in to view this page.</div>
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      gender: true,
      city: true,
      university: true,
      profession: true,
      budget: true,
      isVerified: true,
      privateProfile: true,
    },
  })

  if (!user) {
    return <div className="p-6 text-center">User not found.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Gender:</strong> {user.gender || "Not set"}</p>
        <p><strong>City:</strong> {user.city || "Not set"}</p>
        <p><strong>University / Profession:</strong> {user.university || user.profession || "Not set"}</p>
        <p><strong>Budget:</strong> {user.budget ? `Rs. ${user.budget}` : "Not set"}</p>
        <p>
          <strong>Verification Status:</strong>{" "}
          {user.isVerified ? (
            <span className="text-green-600 font-semibold">Verified ✅</span>
          ) : (
            <span className="text-yellow-500 font-semibold">Pending</span>
          )}
        </p>
        <p>
          <strong>Private Profile:</strong>{" "}
          {user.privateProfile ? "Enabled" : "Disabled"}
        </p>
      </div>

      {/* 🔜 Add Edit Profile or Upload Verification buttons here */}
    </div>
  )
}
