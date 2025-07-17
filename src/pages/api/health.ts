import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  return res.status(200).json({
    status: "healthy",
    message: "API is working",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    databaseUrl: !!process.env.DATABASE_URL
  })
}
