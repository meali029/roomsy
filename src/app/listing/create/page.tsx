"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function CreateListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    city: "",
    location: "",
    genderPreference: "Any",
    availableFrom: "",
    availableMonths: 1,
    imageUrls: [] as string[],
  })

  const [uploading, setUploading] = useState(false)

  // Show loading state
  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  // Show unauthorized state
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Please log in to create a listing.</div>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return
    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        try {
          // Try Cloudinary first
          const formData = new FormData()
          formData.append("file", file)
          formData.append("upload_preset", "roomsy")

          const res = await fetch("https://api.cloudinary.com/v1_1/dvcwmbk6y/image/upload", {
            method: "POST",
            body: formData,
          })

          const data = await res.json()
          
          if (res.ok && data.secure_url) {
            uploadedUrls.push(data.secure_url)
            console.log("✅ Cloudinary upload successful:", data.secure_url)
          } else {
            throw new Error(`Cloudinary error: ${data.error?.message || 'Upload failed'}`)
          }
        } catch (cloudinaryError) {
          console.error("❌ Cloudinary failed:", cloudinaryError)
          
          // Fallback: Use our API endpoint with placeholder
          try {
            const fallbackRes = await fetch("/api/upload/images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileName: file.name })
            })
            
            const fallbackData = await fallbackRes.json()
            if (fallbackRes.ok && fallbackData.urls?.[0]) {
              uploadedUrls.push(fallbackData.urls[0])
              console.log("✅ Fallback upload successful")
            } else {
              throw new Error("Fallback also failed")
            }
          } catch (fallbackError) {
            console.error("❌ Fallback failed:", fallbackError)
            // Last resort: use placeholder
            uploadedUrls.push("/assets/roomsy-hero.png")
          }
        }
      }

      setFormData((prev) => ({ ...prev, imageUrls: uploadedUrls }))
      
      if (uploadedUrls.length > 0) {
        const hasCloudinaryUrls = uploadedUrls.some(url => url.includes('cloudinary'))
        if (!hasCloudinaryUrls) {
          alert("Image upload used placeholder. To upload real images, configure Cloudinary upload preset.")
        }
      }
    } catch (error) {
      console.error("❌ Upload error:", error)
      alert("Image upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        alert("Listing created successfully!")
        router.push("/listing")
      } else {
        const errorData = await res.json()
        alert(`Error: ${errorData.message || "Something went wrong."}`)
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      alert("Network error. Please try again.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} required placeholder="Title" className="input" />
        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" className="input h-24" />
        <input name="rent" type="number" value={formData.rent} onChange={handleChange} required placeholder="Monthly Rent" className="input" />
        <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="input" />
        <input name="location" value={formData.location} onChange={handleChange} required placeholder="Exact Area (e.g., G-9, Johar Town)" className="input" />
        <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="input">
          <option value="Any">Any</option>
          <option value="Male">Only Males</option>
          <option value="Female">Only Females</option>
        </select>
        <input name="availableFrom" type="date" value={formData.availableFrom} onChange={handleChange} required className="input" />
        <input name="availableMonths" type="number" min={1} max={12} value={formData.availableMonths} onChange={handleChange} required className="input" placeholder="Available for how many months?" />

        {/* 🔼 Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Images (Optional)
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={(e) => handleImageUpload(e.target.files)} 
            className="input" 
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, imageUrls: ["/assets/roomsy-hero.png"] }))}
              className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            >
              Use Default Image
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, imageUrls: [] }))}
              className="text-xs bg-red-200 text-red-700 px-3 py-1 rounded hover:bg-red-300"
            >
              No Images
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload up to 5 images of your property. If upload fails, a placeholder will be used.
          </p>
        </div>
        {uploading && <p className="text-sm text-yellow-500">Uploading images...</p>}

        {/* 🔍 Preview uploaded images */}
        {formData.imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {formData.imageUrls.map((url, i) => (
              <Image 
                key={i} 
                src={url} 
                alt={`preview-${i}`} 
                width={200}
                height={96}
                className="w-full h-24 object-cover rounded" 
              />
            ))}
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Post Listing
        </button>
      </form>
    </div>
  )
}
