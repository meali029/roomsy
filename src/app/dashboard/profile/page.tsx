"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  User, 
  Mail, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Save,
  X,
  Lock,
  Unlock,
  Camera,
  AlertTriangle
} from "lucide-react"
import { cities } from "@/constants/cities"
import { genders } from "@/constants/genders"
import { universities } from "@/constants/universities"
import { professions } from "@/constants/professions"

export const dynamic = 'force-dynamic'

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
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>("")
  const [successMsg, setSuccessMsg] = useState<string>("")
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "",
    budget: "",
    city: "",
    university: "",
    profession: "",
    privateProfile: false
  })

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
          // Initialize edit form with current data
          setEditForm({
            name: data.user.name || "",
            gender: data.user.gender || "",
            budget: data.user.budget?.toString() || "",
            city: data.user.city || "",
            university: data.user.university || "",
            profession: data.user.profession || "",
            privateProfile: data.user.privateProfile || false
          })
        } else if (res.status === 503) {
          setStatusMsg("Database unavailable. Please try again shortly.")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status, router])

  const handleEdit = () => {
    setEditing(true)
    setSuccessMsg("")
    setStatusMsg("")
  }

  const handleCancel = () => {
    setEditing(false)
    // Reset form to original values
    if (profile) {
      setEditForm({
        name: profile.name || "",
        gender: profile.gender || "",
        budget: profile.budget?.toString() || "",
        city: profile.city || "",
        university: profile.university || "",
        profession: profile.profession || "",
        privateProfile: profile.privateProfile || false
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setStatusMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (res.ok) {
        setProfile(data.user)
        setEditing(false)
        setSuccessMsg("Profile updated successfully!")
      } else {
        setStatusMsg(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setStatusMsg("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-mint-cream/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-rich-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-rich-green font-medium text-sm sm:text-base">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="min-h-screen bg-mint-cream/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-rich-green via-forest-teal to-deep-teal text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-deep-teal mb-6 sm:mb-8">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                  {profile?.profilePicture ? (
                    <Image 
                      src={profile.profilePicture} 
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white text-rich-green rounded-full flex items-center justify-center shadow-soft hover:scale-110 transition-transform duration-200">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-white truncate">
                  {editing ? editForm.name : profile?.name}
                </h1>
                <p className="text-mint-cream/90 text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 truncate">{profile?.email}</p>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    {profile?.isVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-soft-sage" />
                        <span className="text-soft-sage font-medium text-sm sm:text-base">Verified Account</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                        <span className="text-yellow-300 font-medium text-sm sm:text-base">Pending Verification</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {(editing ? editForm.privateProfile : profile?.privateProfile) ? (
                      <>
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-mint-cream/70" />
                        <span className="text-mint-cream/70 text-xs sm:text-sm">Private</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-mint-cream/70" />
                        <span className="text-mint-cream/70 text-xs sm:text-sm">Public</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
              {!editing ? (
                <button 
                  onClick={handleEdit}
                  className="glass-mint hover:bg-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105 text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="glass-mint hover:bg-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="glass-mint hover:bg-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 text-rich-green font-medium hover:scale-105 text-sm sm:text-base"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {statusMsg && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg shadow-soft">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{statusMsg}</p>
              </div>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg shadow-soft">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMsg}</p>
              </div>
            </div>
          </div>
        )}

        {profile ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="card-mint p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-rich-green to-forest-teal px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Personal Information
                  </h2>
                </div>
                <div className="p-4 sm:p-6 bg-white">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rich-green/70">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                          required
                        />
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="icon-circle-sage flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <p className="text-rich-green font-semibold text-sm sm:text-base truncate">{profile.name}</p>
                        </div>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rich-green/70">Email Address</label>
                      <div className="flex items-center space-x-3">
                        <div className="icon-circle-teal flex-shrink-0">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <p className="text-rich-green font-semibold text-sm sm:text-base truncate">{profile.email}</p>
                      </div>
                    </div>

                    {/* Gender and City in a responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-rich-green/70">Gender</label>
                        {editing ? (
                          <select
                            value={editForm.gender}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                            required
                          >
                            <option value="">Select Gender</option>
                            {genders.map((gender) => (
                              <option key={gender.id} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="icon-circle-sage flex-shrink-0">
                              <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <p className="text-rich-green font-semibold text-sm sm:text-base capitalize">{profile.gender}</p>
                          </div>
                        )}
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-rich-green/70">City</label>
                        {editing ? (
                          <select
                            value={editForm.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                            required
                          >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="icon-circle-teal flex-shrink-0">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <p className="text-rich-green font-semibold text-sm sm:text-base">{profile.city}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="card-mint p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-forest-teal to-deep-teal px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Academic & Professional
                  </h2>
                </div>
                <div className="p-4 sm:p-6 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* University */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rich-green/70">University</label>
                      {editing ? (
                        <select
                          value={editForm.university}
                          onChange={(e) => handleInputChange("university", e.target.value)}
                          className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                        >
                          <option value="">Select University (Optional)</option>
                          {universities.map((uni) => (
                            <option key={uni.id} value={uni.name}>
                              {uni.name} - {uni.city}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="icon-circle-sage flex-shrink-0">
                            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <p className="text-rich-green font-semibold text-sm sm:text-base">
                            {profile.university || 'Not specified'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rich-green/70">Profession</label>
                      {editing ? (
                        <select
                          value={editForm.profession}
                          onChange={(e) => handleInputChange("profession", e.target.value)}
                          className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                        >
                          <option value="">Select Profession (Optional)</option>
                          {professions.map((prof) => (
                            <option key={prof.id} value={prof.label}>
                              {prof.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="icon-circle-teal flex-shrink-0">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <p className="text-rich-green font-semibold text-sm sm:text-base">
                            {profile.profession || 'Not specified'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Budget */}
              <div className="card-sage p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-rich-green mb-3 sm:mb-4 flex items-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Budget Preferences
                </h3>
                {editing ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rich-green/70">Monthly Budget (Rs.)</label>
                    <input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="Enter budget (optional)"
                      className="w-full px-3 py-2 border border-soft-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-green focus:border-transparent text-sm sm:text-base"
                      min="0"
                    />
                  </div>
                ) : (
                  <div className="text-center p-3 sm:p-4 bg-soft-sage/10 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-rich-green mb-1">
                      Rs. {profile.budget?.toLocaleString() || 'Not set'}
                    </p>
                    <p className="text-xs sm:text-sm text-rich-green/70">Monthly Budget</p>
                  </div>
                )}
              </div>

              {/* Privacy Settings */}
              <div className="card-sage p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-rich-green mb-3 sm:mb-4 flex items-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Privacy Settings
                </h3>
                {editing ? (
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={editForm.privateProfile}
                        onChange={(e) => handleInputChange("privateProfile", e.target.checked)}
                        className="w-4 h-4 text-rich-green bg-gray-100 border-gray-300 rounded focus:ring-rich-green focus:ring-2 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm text-rich-green">Private Profile</span>
                        <p className="text-xs text-rich-green/70 mt-1">
                          When enabled, your profile will only be visible to verified users
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-rich-green/70">Profile Visibility</span>
                      <span className="text-sm font-semibold text-rich-green">
                        {profile.privateProfile ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="card-sage p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-rich-green mb-3 sm:mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Account Type</span>
                    <span className="text-sm font-semibold text-rich-green capitalize">
                      {profile.role?.toLowerCase() || 'User'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Verification</span>
                    <span className={`text-sm font-semibold ${
                      profile.isVerified ? 'text-rich-green' : 'text-yellow-600'
                    }`}>
                      {profile.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rich-green/70">Member Since</span>
                    <span className="text-sm font-semibold text-rich-green">
                      {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-mint p-8 sm:p-12 text-center">
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-soft-sage mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-rich-green mb-2">Profile Unavailable</h3>
            <p className="text-rich-green/70 mb-4 sm:mb-6 text-sm sm:text-base">
              We&apos;re unable to load your profile information at the moment.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-rich text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
