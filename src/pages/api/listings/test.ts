import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Step 1: Test basic database connection
    await prisma.$queryRaw`SELECT 1 as test`
    
    // Step 2: Test if Listing table exists and count records
    const listingCount = await prisma.listing.count()
    
    // Step 3: Fetch a small sample of approved listings
    const sampleListings = await prisma.listing.findMany({
      where: {
        status: "APPROVED"
      },
      take: 3,
      select: {
        id: true,
        title: true,
        city: true,
        rent: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Step 4: Test the full query that the main API uses - only approved listings
    const fullListings = await prisma.listing.findMany({
      where: {
        status: "APPROVED"
      },
      take: 2,
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

    return res.status(200).json({
      status: "All tests passed",
      database: "connected",
      listingCount,
      sampleListings,
      fullListings,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Listings debug error:", error)
    return res.status(500).json({
      error: "Database operation failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    })
  }
}
