import VerificationRequestsList from "@/components/admin/VerificationRequestsList"

export const dynamic = "force-dynamic"

interface VerificationRequest {
  id: string
  cnicUrl: string
  createdAt: Date
  User: {
    id: string
    name: string
    email: string
    isBanned: boolean
    banReason: string | null
  }
}

async function fetchPending(): Promise<{ requests: VerificationRequest[] }> {
  try {
    // Use direct database query instead of HTTP fetch to avoid server-side fetch issues
    const { prisma } = await import("@/libs/prisma")
    
    const requests = await prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: { 
        User: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            isBanned: true,
            banReason: true
          } 
        } 
      },
      orderBy: { createdAt: "desc" },
    })
    
    return { requests }
  } catch (error) {
    console.error("Error fetching verifications:", error)
    return { requests: [] }
  }
}

export default async function AdminVerificationsPage() {
  const { requests } = await fetchPending()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Verification Management</h1>
        <p className="text-gray-600">Review and approve user CNIC documents</p>
      </div>
      
      <VerificationRequestsList initialRequests={requests} />
    </div>
  )
}
