import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { uploadImageToCloudinary } from "@/libs/cloudinary"
import { randomUUID } from "crypto"

async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    res.status(401).json({ message: "Unauthorized" })
    return null
  }
  return session
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const session = await requireAuth(req, res)
      if (!session) return

      const { cnicBase64 } = req.body || {}
      if (!cnicBase64 || typeof cnicBase64 !== "string") {
        return res.status(400).json({ message: "cnicBase64 is required" })
      }


      // Upload CNIC image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(
        cnicBase64, 
        'roomsy/cnic', // folder structure in Cloudinary
        'image'
      )

      if (!uploadResult.success) {
        console.error("Cloudinary upload error:", uploadResult.error)
        return res.status(500).json({ 
          message: "Failed to upload image. Please try again.", 
          error: uploadResult.error 
        })
      }


      // Now TypeScript knows uploadResult is the success type
      const imageUrl = uploadResult.url

      // Create or update verification request with Cloudinary URL
      const request = await prisma.verificationRequest.upsert({
        where: { userId: session.user.id },
        update: { 
          cnicUrl: imageUrl, 
          status: "PENDING" 
        },
        create: {
          id: randomUUID(),
          userId: session.user.id,
          cnicUrl: imageUrl,
          videoUrl: "",
          status: "PENDING",
        },
      })


      return res.status(201).json({ request })
    }

    if (req.method === "GET") {
      const session = await requireAuth(req, res)
      if (!session) return
      if (session.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

      const requests = await prisma.verificationRequest.findMany({
        where: { status: "PENDING" },
        include: { User: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      })
      return res.status(200).json({ requests })
    }

    if (req.method === "PATCH") {
      const session = await requireAuth(req, res)
      if (!session) return
      if (session.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

      const { id, action } = req.body || {}
      if (!id || !["APPROVED", "REJECTED"].includes(action)) {
        return res.status(400).json({ message: "id and action(APPROVED|REJECTED) required" })
      }

      const updated = await prisma.verificationRequest.update({
        where: { id: String(id) },
        data: { status: action },
      })

      if (action === "APPROVED") {
        await prisma.user.update({ where: { id: updated.userId }, data: { isVerified: true } })
      }

      return res.status(200).json({ request: updated })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Verify API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
