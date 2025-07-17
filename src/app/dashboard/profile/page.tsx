"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  gender: string
  budget?: number
  city: string
  university?: string
  profession?: string
  profilePicture?: string
  isVerified: boolean
  privateProfile: boolean
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data.user)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      
      {profile ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{profile.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-gray-900">{profile.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <p className="text-gray-900">{profile.city}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <p className="text-gray-900">Rs. {profile.budget?.toLocaleString() || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">University</label>
                  <p className="text-gray-900">{profile.university || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profession</label>
                  <p className="text-gray-900">{profile.profession || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                  <p className={`text-sm ${profile.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {profile.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      )}
    </div>
  )
}
