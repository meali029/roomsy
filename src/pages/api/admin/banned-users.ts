import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (session.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" })
    }

    if (req.method === "GET") {
      // Get all banned users
      const bannedUsers = await prisma.user.findMany({
        where: { isBanned: true },
        select: {
          id: true,
          name: true,
          email: true,
          isBanned: true,
          banReason: true,
          bannedAt: true,
          bannedBy: true,
          createdAt: true,
          _count: {
            select: {
              listings: true
            }
          }
        },
        orderBy: { bannedAt: "desc" }
      })

      return res.status(200).json({ bannedUsers })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Admin banned users API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
