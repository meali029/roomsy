import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user) {
      return res.status(401).json({ message: "Unauthorized" })
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
      imageUrls = [], // 👈 Accept imageUrls
    } = req.body

    if (!title || !description || !rent || !city || !availableFrom) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    try {
      const listing = await prisma.listing.create({
        data: {
          title,
          description,
          rent: Number(rent),
          city,
          location,
          genderPreference,
          availableFrom: new Date(availableFrom),
          availableMonths: Number(availableMonths),
          imageUrls,
          userId: session.user.id,
        },
      })

      return res.status(201).json({ message: "Listing created", listing })
    } catch (error) {
      console.error("❌ POST error:", error)
      return res.status(500).json({ message: "Failed to create listing" })
    }
  }

  if (req.method === "GET") {
    try {
      const listings = await prisma.listing.findMany({
        // Remove or update the 'where' clause if 'isArchived' does not exist
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              city: true,
              gender: true,
              isVerified: true,
            },
          },
        },
      })

      return res.status(200).json({ listings })
    } catch (error) {
      console.error("❌ GET error:", error)
      return res.status(500).json({ message: "Failed to fetch listings" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}
