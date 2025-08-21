import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only handle GET requests for now to isolate the issue
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Simplified query without complex includes - only show approved listings
    const listings = await prisma.listing.findMany({
      where: {
        status: "APPROVED"
      },
      take: 10, // Limit results to avoid timeout
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        rent: true,
        city: true,
        location: true,
        genderPreference: true,
        availableFrom: true,
        availableMonths: true,
        imageUrls: true,
        createdAt: true,
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

    return res.status(200).json({ 
      success: true,
      count: listings.length,
      listings,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Simple listings API error:", error)
    
    return res.status(500).json({ 
      success: false,
      error: "Failed to fetch listings",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    })
  }
}
