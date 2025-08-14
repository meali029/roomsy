import type { NextApiRequest, NextApiResponse } from "next"

// Disabled in production: remove test/diagnostic surface.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(404).json({ message: "Not found" })
}
