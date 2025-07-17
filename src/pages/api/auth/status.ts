import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  // Simple test to see if the API routes are working
  return res.status(200).json({
    status: "NextAuth API routes are working",
    environment: process.env.NODE_ENV,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    url: process.env.NEXTAUTH_URL,
    timestamp: new Date().toISOString()
  })
}
