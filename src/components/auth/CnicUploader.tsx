"use client"

import { useState } from "react"

export default function CnicUploader() {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setStatus("")
    try {
      const base64 = await toBase64(file)
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnicBase64: base64 }),
      })
      if (!res.ok) throw new Error("Upload failed")
      setStatus("Submitted for verification")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed"
      setStatus(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload CNIC</label>
      <input type="file" accept="image/*" onChange={onChange} className="input" />
      {loading ? <p className="text-sm text-gray-500 mt-2">Uploading...</p> : null}
      {status ? <p className="text-sm mt-2">{status}</p> : null}
    </div>
  )
}
