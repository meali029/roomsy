import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== "string") return res.status(400).json({ message: "Invalid id" })

  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions)
      
      const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, city: true, gender: true, isVerified: true },
          },
        },
      })
      
      if (!listing) return res.status(404).json({ message: "Listing not found" })
      
      // Only show listing to public, but allow owners and admins to see their own
      const isOwner = session?.user?.id === listing.userId
      const isAdmin = session?.user?.role === "ADMIN"
      
      if (!isOwner && !isAdmin) {
        // For public access, we can show all listings for now
        // TODO: Add approval system later if needed
      }
      
      return res.status(200).json({ listing })
    }

    if (req.method === "PATCH") {
      const session = await getServerSession(req, res, authOptions)
      if (!session?.user?.id) return res.status(401).json({ message: "Unauthorized" })

      const existing = await prisma.listing.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ message: "Listing not found" })
      if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" })
      }

      const {
        title,
        description,
        rent,
        city,
        location,
        genderPreference,
        availableFrom,
        availableMonths,
        imageUrls,
      } = req.body || {}

      const data: Record<string, unknown> = {}
      if (title !== undefined) data.title = String(title)
      if (description !== undefined) data.description = String(description)
      if (rent !== undefined) data.rent = Number(rent)
      if (city !== undefined) data.city = String(city)
      if (location !== undefined) data.location = location ? String(location) : null
      if (genderPreference !== undefined) data.genderPreference = String(genderPreference)
      if (availableFrom !== undefined) data.availableFrom = new Date(availableFrom)
      if (availableMonths !== undefined) data.availableMonths = Number(availableMonths)
      if (imageUrls !== undefined) data.imageUrls = Array.isArray(imageUrls) ? imageUrls : []

      // TODO: Add approval system later if needed
      // if (existing.userId === session.user.id && session.user.role !== "ADMIN") {
      //   data.status = "PENDING"
      //   data.rejectionReason = null
      // }

      const updated = await prisma.listing.update({ where: { id }, data })
      return res.status(200).json({ listing: updated })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Listing by id API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
