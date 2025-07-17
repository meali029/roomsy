"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MapPicker from "@/components/map/MapPicker"

interface ListingFormData {
  title: string
  description: string
  rent: string
  city: string
  location: string
  genderPreference: string
  availableFrom: string
  availableMonths: number
  imageUrls: string[]
}

interface ListingFormProps {
  defaultValues?: ListingFormData
}

export default function ListingForm({ defaultValues }: ListingFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState(
    defaultValues || {
      title: "",
      description: "",
      rent: "",
      city: "",
      location: "",
      genderPreference: "Any",
      availableFrom: "",
      availableMonths: 1,
      imageUrls: [] as string[],
    }
  )

  const [uploading, setUploading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "roomsy-preset") // 🔁 Cloudinary preset
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dvcwmbk6y/image/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.secure_url) uploadedUrls.push(data.secure_url)
      } catch (err) {
        console.error("Upload error", err)
      }
    }

    setFormData((prev) => ({ ...prev, imageUrls: uploadedUrls }))
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/listings", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      router.push("/dashboard/listings")
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={formData.title} onChange={handleChange} required placeholder="Title" className="input" />
      <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" className="input h-24" />
      <input name="rent" type="number" value={formData.rent} onChange={handleChange} required placeholder="Monthly Rent" className="input" />
      <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="input" />
      <input name="location" value={formData.location} onChange={handleChange} required placeholder="Exact Area" className="input" />

      <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="input">
        <option value="Any">Any</option>
        <option value="Male">Only Males</option>
        <option value="Female">Only Females</option>
      </select>

      <input name="availableFrom" type="date" value={formData.availableFrom} onChange={handleChange} required className="input" />
      <input name="availableMonths" type="number" min={1} max={12} value={formData.availableMonths} onChange={handleChange} required className="input" />

      {/* 👇 Multiple Image Upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageUpload(e.target.files)}
        className="input"
      />

      {uploading && <p className="text-sm text-yellow-500">Uploading images...</p>}

      {/* Preview */}
      <div className="grid grid-cols-3 gap-2">
        {formData.imageUrls.map((url, i) => (
          <img key={i} src={url} alt={`preview-${i}`} className="w-full h-24 object-cover rounded" />
        ))}
      </div>
<MapPicker
  onLocationChange={(address) => setFormData({ ...formData, location: address })}
  defaultLocation={formData.location}
/>

      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        Post Listing
      </button>
    </form>
  )
}
