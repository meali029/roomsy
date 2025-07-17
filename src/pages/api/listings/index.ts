import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      // Check authentication for creating listings
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

      // Create listing with authenticated user
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
          userId: session.user.id, // Use authenticated user ID
        },
      })

      return res.status(201).json({ message: "Listing created", listing })
    }

    if (req.method === "GET") {
      // Add better error handling for database connection
      if (!prisma) {
        return res.status(500).json({ 
          message: "Database connection error",
          error: "Prisma client not available"
        })
      }

      const listings = await prisma.listing.findMany({
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
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("❌ API error:", error)
    
    // Return more detailed error information
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      // Only include stack trace in development
      ...(process.env.NODE_ENV === "development" && { 
        stack: error instanceof Error ? error.stack : undefined 
      })
    })
  }
}
