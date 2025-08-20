"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, CheckCircle, AlertCircle, X, Eye, Clock, Shield } from "lucide-react"

interface VerificationStatus {
  isVerified: boolean
  hasSubmittedRequest: boolean
  requestStatus: string | null
  submittedAt: string | null
  canResubmit: boolean
}

export default function CnicUploader() {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch verification status on component mount
  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const res = await fetch("/api/user/verification-status")
      if (res.ok) {
        const data = await res.json()
        setVerificationStatus(data.verification)
      }
    } catch (error) {
      console.error("Failed to fetch verification status:", error)
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    setError(null)
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    handleFileSelect(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files
      }
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const uploadFile = async () => {
    if (!preview) return
    
    setLoading(true)
    setStatus("")
    setError(null)
    setSuccess(false)
    
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnicBase64: preview }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Upload failed")
      }
      
      setStatus("CNIC submitted successfully! Your verification request is now pending review.")
      setSuccess(true)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      // Refresh verification status
      await fetchVerificationStatus()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed"
      console.error("Upload error:", e)
      setError(msg.includes("Failed to upload image") 
        ? "Image upload failed. Please check your internet connection and try again." 
        : msg
      )
    } finally {
      setLoading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setError(null)
    setStatus("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading verification status...</span>
      </div>
    )
  }

  // If already verified, show success state
  if (verificationStatus?.isVerified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Verification Complete!</h3>
            <p className="text-green-700">Your account has been successfully verified. You now have access to all premium features.</p>
          </div>
        </div>
      </div>
    )
  }

  // If has pending request, show pending state
  if (verificationStatus?.hasSubmittedRequest && verificationStatus?.requestStatus === "PENDING") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Verification Pending</h3>
            <p className="text-blue-700">
              Your CNIC has been submitted and is currently under review. 
              {verificationStatus.submittedAt && (
                <span className="block text-sm mt-1">
                  Submitted on {new Date(verificationStatus.submittedAt).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If request was rejected, show option to resubmit
  if (verificationStatus?.requestStatus === "REJECTED") {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Verification Rejected</h3>
              <p className="text-red-700">
                Your previous verification request was rejected. Please ensure your CNIC image is clear and readable before resubmitting.
              </p>
            </div>
          </div>
        </div>
        
        {/* Show upload form for resubmission */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Resubmit Verification</h4>
          {renderUploadForm()}
        </div>
      </div>
    )
  }

  // Default state - show upload form
  function renderUploadForm() {
    return (
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
            preview 
              ? "border-indigo-300 bg-indigo-50/50" 
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {!preview ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Upload your CNIC</p>
                <p className="text-sm text-gray-500">
                  Drag and drop your CNIC image here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports: JPG, PNG, JPEG (Max: 5MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">Preview</span>
                </div>
                <button
                  onClick={clearPreview}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={loading}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="CNIC Preview"
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm border"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && status && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{status}</p>
          </div>
        )}

        {/* Action Buttons */}
        {preview && !success && (
          <div className="flex space-x-3">
            <button
              onClick={uploadFile}
              disabled={loading}
              className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </button>
            <button
              onClick={clearPreview}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-blue-500">ℹ️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Why do we need verification?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc space-y-1 ml-4">
                  <li>Ensures safety and trust in our community</li>
                  <li>Protects against fraud and fake profiles</li>
                  <li>Verified users get higher visibility and trust</li>
                  <li>Required for certain premium features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return renderUploadForm()
}
