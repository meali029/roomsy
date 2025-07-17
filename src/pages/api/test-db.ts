import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Get basic counts
    const userCount = await prisma.user.count()
    const listingCount = await prisma.listing.count()
    
    return res.status(200).json({ 
      status: "Database connected",
      userCount,
      listingCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database test error:", error)
    return res.status(500).json({ 
      status: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    })
  }
}
