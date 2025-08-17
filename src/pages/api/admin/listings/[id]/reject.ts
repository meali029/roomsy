import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
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

    const { id } = req.query
    const { reason } = req.body

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid listing ID" })
    }

    // Reject the listing
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectionReason: reason || "Listing does not meet platform guidelines",
        approvedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return res.status(200).json({ 
      message: "Listing rejected successfully", 
      listing 
    })
  } catch (error) {
    console.error("Error rejecting listing:", error)
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
