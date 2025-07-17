import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ 
      message: "Auth test endpoint is working",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  }
  
  return res.status(405).json({ message: "Method not allowed" })
}
