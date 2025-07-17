import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    // For now, return a placeholder URL
    // In production, you would implement actual file upload logic
    const placeholderUrls = [
      "/assets/roomsy-hero.png", // Using existing image as placeholder
    ]

    return res.status(200).json({ 
      message: "Upload successful", 
      urls: placeholderUrls 
    })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({ message: "Upload failed" })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
