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

    if (req.method === "POST") {
      const { requestId, action, banReason, userId } = req.body

      // For unban action, we need userId instead of requestId
      if (action === "unban") {
        if (!userId) {
          return res.status(400).json({ message: "userId is required for unban action" })
        }

        // Unban the user
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { 
            isBanned: false,
            banReason: null,
            bannedAt: null,
            bannedBy: null
          }
        })

        return res.status(200).json({ 
          message: "User unbanned successfully",
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isBanned: updatedUser.isBanned
          }
        })
      }

      if (!requestId || !action) {
        return res.status(400).json({ message: "requestId and action are required" })
      }

      if (!["approve", "reject", "ban"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be approve, reject, ban, or unban" })
      }

      // Get the verification request with user details
      const verificationRequest = await prisma.verificationRequest.findUnique({
        where: { id: requestId },
        include: { User: true }
      })

      if (!verificationRequest) {
        return res.status(404).json({ message: "Verification request not found" })
      }

      const verificationUserId = verificationRequest.userId

      if (action === "approve") {
        // Approve verification
        await prisma.$transaction([
          prisma.verificationRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" }
          }),
          prisma.user.update({
            where: { id: verificationUserId },
            data: { isVerified: true }
          })
        ])

        return res.status(200).json({ 
          message: "User verification approved successfully",
          verificationRequest: await prisma.verificationRequest.findUnique({
            where: { id: requestId },
            include: { User: { select: { id: true, name: true, email: true, isVerified: true } } }
          })
        })
      }

      if (action === "reject") {
        // Reject verification
        const updated = await prisma.verificationRequest.update({
          where: { id: requestId },
          data: { status: "REJECTED" }
        })

        return res.status(200).json({ 
          message: "User verification rejected",
          verificationRequest: updated
        })
      }

      if (action === "ban") {
        if (!banReason || banReason.trim().length === 0) {
          return res.status(400).json({ message: "Ban reason is required when banning a user" })
        }

        // Ban user and reject verification
        await prisma.$transaction([
          prisma.verificationRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" }
          }),
          prisma.user.update({
            where: { id: verificationUserId },
            data: { 
              isBanned: true,
              banReason: banReason.trim(),
              bannedAt: new Date(),
              bannedBy: session.user.id,
              isVerified: false
            }
          })
        ])

        return res.status(200).json({ 
          message: "User banned successfully",
          banReason: banReason.trim()
        })
      }
    }

    if (req.method === "GET") {
      // Get all pending verification requests for admin
      const requests = await prisma.verificationRequest.findMany({
        where: { status: "PENDING" },
        include: { 
          User: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              isVerified: true,
              isBanned: true,
              banReason: true,
              bannedAt: true,
              createdAt: true
            } 
          } 
        },
        orderBy: { createdAt: "desc" },
      })

      return res.status(200).json({ requests })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Admin verify API error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
