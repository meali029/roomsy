import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" })
    }

    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          gender: true,
          city: true,
          isVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return res.status(200).json({ users })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Admin users API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
