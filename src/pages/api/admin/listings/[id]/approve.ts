import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint is disabled since status field doesn't exist in the database
  return res.status(404).json({ message: "Not found" })
}
