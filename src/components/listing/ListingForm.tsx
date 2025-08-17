"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Upload, X, DollarSign, Calendar, Home, Users } from "lucide-react"
import { cities, popularCities } from '@/constants/cities'
import { getUniversitiesByCity } from '@/constants/universities'
import { roommatePrefGenders } from '@/constants/genders'
import { professionCategories, getProfessionsByCategory } from '@/constants/professions'
import { roomTypes, propertyTypes, amenities } from '@/constants/filters'

export interface ListingFormData {
  title: string
  description: string
  rent: string
  city: string
  location: string
  genderPreference: string
  availableFrom: string
  availableMonths: number
  imageUrls: string[]
  roomType: string
  propertyType: string
  amenities: string[]
  university: string
  profession: string
}

export interface ListingFormProps {
  defaultValues?: Partial<ListingFormData>
  onSubmit?: (data: ListingFormData) => Promise<void> | void
  submitLabel?: string
}

export default function ListingForm({ defaultValues, onSubmit, submitLabel }: ListingFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    rent: "",
    city: "",
    location: "",
    genderPreference: "any",
    availableFrom: "",
    availableMonths: 1,
    imageUrls: [] as string[],
    roomType: "",
    propertyType: "",
    amenities: [] as string[],
    university: "",
    profession: "",
    ...defaultValues
  })

  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")

  // Get universities for selected city
  const cityUniversities = formData.city ? getUniversitiesByCity(formData.city) : []

  // Get professions for selected category
  const categoryProfessions = selectedCategory ? getProfessionsByCategory(selectedCategory) : []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Reset university when city changes
    if (name === 'city') {
      setFormData(prev => ({ ...prev, university: '' }))
    }

    // Reset profession when category changes
    if (name === 'professionCategory') {
      setSelectedCategory(value)
      setFormData(prev => ({ ...prev, profession: '' }))
    }
  }

  const handleAmenityToggle = (amenityValue: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityValue)
        ? prev.amenities.filter(a => a !== amenityValue)
        : [...prev.amenities, amenityValue]
    }))
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      console.log("Uploading file:", file.name, file.size, file.type)
      
      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      try {
        const base64 = await base64Promise
        
        const res = await fetch("/api/upload/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        })
        
        console.log("Upload response status:", res.status)
        const data = await res.json()
        console.log("Upload response data:", data)
        
        if (!res.ok) {
          console.error("Upload error:", data)
          alert(`Upload failed: ${data.message || 'Unknown error'}`)
          continue
        }
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url)
          console.log("Successfully uploaded:", data.secure_url)
        }
      } catch (err) {
        console.error("Upload error", err)
        alert(`Upload failed for ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    console.log("All uploaded URLs:", uploadedUrls)
    setFormData((prev) => ({ 
      ...prev, 
      imageUrls: [...prev.imageUrls, ...uploadedUrls] 
    }))
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Submitting form data:", formData)
    console.log("Image URLs being submitted:", formData.imageUrls)

    try {
      if (onSubmit) {
        await onSubmit(formData)
        return
      }
      const res = await fetch("/api/listings", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
      
      const result = await res.json()
      console.log("API response:", result)
      
      if (res.ok) {
        router.push("/dashboard")
      } else {
        alert(result.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Network error. Please try again.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <Home className="w-6 h-6 mr-3 text-rich-green" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Listing Title *
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Spacious Room Near LUMS"
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input pl-11 w-full"
                >
                  <option value="">Select City</option>
                  {popularCities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                  <optgroup label="All Cities">
                    {cities.filter(city => !city.popular).map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Monthly Rent (PKR) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  name="rent"
                  type="number"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                  placeholder="25000"
                  className="input pl-11 w-full"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your room, nearby facilities, and what you're looking for in a roommate..."
                rows={4}
                className="input w-full resize-none"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <Home className="w-6 h-6 mr-3 text-rich-green" />
            Property Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Room Type *
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type.id} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Available From *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                  className="input pl-11 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Available for (months) *
              </label>
              <input
                name="availableMonths"
                type="number"
                min={1}
                max={12}
                value={formData.availableMonths}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenities.map(amenity => (
                <label key={amenity.id} className="flex items-center p-3 bg-white border-2 border-rich-green/20 rounded-lg cursor-pointer hover:bg-rich-green/5 hover:border-rich-green/40 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(String(amenity.value))}
                    onChange={() => handleAmenityToggle(String(amenity.value))}
                    className="mr-3 w-4 h-4 accent-rich-green"
                  />
                  <span className="text-sm text-rich-green font-medium">
                    {amenity.icon} {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-rich-green" />
            Roommate Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gender Preference *
              </label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                required
                className="input w-full"
              >
                {roommatePrefGenders.map(gender => (
                  <option key={gender.id} value={gender.value}>
                    {gender.icon} {gender.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nearby University
              </label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="input w-full"
                disabled={!formData.city}
              >
                <option value="">Select University (Optional)</option>
                {cityUniversities.map(uni => (
                  <option key={uni.id} value={uni.name}>
                    {uni.name} - {uni.fullName}
                  </option>
                ))}
              </select>
              {!formData.city && (
                <p className="text-sm text-neutral-500 mt-1">Select a city first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Profession Category
              </label>
              <select
                name="professionCategory"
                value={selectedCategory}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">Select Category (Optional)</option>
                {professionCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Preferred Profession
              </label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="input w-full"
                disabled={!selectedCategory}
              >
                <option value="">Select Profession (Optional)</option>
                {categoryProfessions.map(prof => (
                  <option key={prof.id} value={prof.label}>{prof.label}</option>
                ))}
              </select>
              {!selectedCategory && (
                <p className="text-sm text-neutral-500 mt-1">Select a category first</p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-rich-green" />
            Location
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Exact Area/Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-5 h-5" />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter complete address (e.g., House 123, Block A, DHA Phase 5, Lahore)"
                className="input pl-11 w-full"
              />
            </div>
            <p className="text-xs text-rich-green/60 mt-2">
              💡 <strong>Tip:</strong> Include house number, block/street, area, and city for better visibility to potential roommates
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-rich-green" />
            Photos
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Upload Images (Max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="input w-full"
              disabled={formData.imageUrls.length >= 5}
            />
            {uploading && <p className="text-sm text-yellow-600 mt-2">Uploading images...</p>}
          </div>

          {/* Image Preview */}
          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="relative w-full h-32">
                    <Image 
                      src={url} 
                      alt={`preview-${i}`} 
                      fill
                      className="object-cover rounded-lg" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button 
            type="submit" 
            className="btn-primary px-12 py-4 text-lg"
            disabled={uploading}
          >
            {submitLabel || "Post Listing"}
          </button>
        </div>
      </form>
    </div>
  )
}
