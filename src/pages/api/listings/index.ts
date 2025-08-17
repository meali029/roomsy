import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { Prisma } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions)
      if (!session?.user?.id) {
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

      // Create listing owned by the authenticated user
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
            status: "PENDING", // Default to pending approval
          },
        })
        return res.status(201).json({ message: "Listing created", listing })
      } catch (e: unknown) {
        const err = e as { code?: string; message?: string }
        if (
          e instanceof Prisma.PrismaClientInitializationError ||
          err.code === "P1001" ||
          /Can't reach database server/i.test(err.message || "")
        ) {
          return res.status(503).json({ message: "Database unavailable. Please try again shortly." })
        }
        throw e
      }
    }

    if (req.method === "GET") {
      try {
        // Only show approved listings for public browsing
        const listings = await prisma.listing.findMany({
          where: {
            status: "APPROVED"
          },
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
      } catch (e: unknown) {
        const err = e as { code?: string; message?: string }
        if (
          e instanceof Prisma.PrismaClientInitializationError ||
          err.code === "P1001" ||
          /Can't reach database server/i.test(err.message || "")
        ) {
          // Fail open with an empty list so UI can still render gracefully
          console.warn("DB unreachable in GET /api/listings – returning empty list")
          return res.status(200).json({ listings: [] })
        }
        throw e
      }
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
        stack: error instanceof Error ? error.stack : undefined,
      }),
    })
  }
}
