import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Return mock data for now to test if the API endpoint works
    const mockListings = [
      {
        id: "1",
        title: "Cozy Room in Downtown",
        description: "A beautiful room in the heart of the city",
        rent: 500,
        city: "Karachi",
        location: "DHA Phase 2",
        genderPreference: "Any",
        availableFrom: "2024-01-01",
        availableMonths: 12,
        imageUrls: ["https://via.placeholder.com/300x200"],
        createdAt: new Date().toISOString(),
        user: {
          id: "1",
          name: "John Doe",
          city: "Karachi",
          gender: "Male",
          isVerified: true,
        },
      },
      {
        id: "2",
        title: "Spacious Room Near University",
        description: "Perfect for students, close to campus",
        rent: 400,
        city: "Lahore",
        location: "Gulberg",
        genderPreference: "Male",
        availableFrom: "2024-02-01",
        availableMonths: 6,
        imageUrls: ["https://via.placeholder.com/300x200"],
        createdAt: new Date().toISOString(),
        user: {
          id: "2",
          name: "Jane Smith",
          city: "Lahore",
          gender: "Female",
          isVerified: false,
        },
      },
    ]

    return res.status(200).json({ 
      success: true,
      listings: mockListings,
      message: "Mock data - API working",
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Mock listings API error:", error)
    
    return res.status(500).json({ 
      success: false,
      error: "Failed to fetch listings",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    })
  }
}
