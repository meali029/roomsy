import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { Prisma } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions)
      if (!session?.user?.id) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      })

      if (user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" })
      }

      try {
        // Get all listings for admin review
        const listings = await prisma.listing.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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
          console.warn("DB unreachable in GET /api/admin/listings – returning empty list")
          return res.status(200).json({ listings: [] })
        }
        throw e
      }
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("❌ API error:", error)

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    })
  }
}
