import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Helper function to upload base64 image to Cloudinary
export async function uploadImageToCloudinary(
  base64Image: string,
  folder: string = 'roomsy',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
): Promise<{
  success: true
  url: string
  publicId: string
  width: number
  height: number
} | {
  success: false
  error: string
}> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: resourceType,
      quality: 'auto',
      fetch_format: 'auto',
    })
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// Helper function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return { success: true, result }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}