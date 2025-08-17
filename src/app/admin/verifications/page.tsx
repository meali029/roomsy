export const dynamic = "force-dynamic"

interface VerificationRequest {
  id: string
  cnicUrl: string
  User: {
    id: string
    name: string
    email: string
  }
}

async function fetchPending(): Promise<{ requests: VerificationRequest[] }> {
  try {
    // Use direct database query instead of HTTP fetch to avoid server-side fetch issues
    const { prisma } = await import("@/libs/prisma")
    
    const requests = await prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: { User: { select: { id: true, name: true, email: true } } },
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Pending Verifications</h1>
      {(!requests || requests.length === 0) ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.User.name} ({r.User.email})</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <a href={r.cnicUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">View CNIC</a>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Approve/Reject would best be a client-layer action; keep stub for now */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
