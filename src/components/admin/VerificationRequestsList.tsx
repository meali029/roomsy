"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Clock, ExternalLink, User, Mail, Calendar } from "lucide-react"
import VerificationActions from "./VerificationActions"

interface VerificationRequest {
  id: string
  cnicUrl: string
  createdAt: Date
  User: {
    id: string
    name: string
    email: string
    isBanned?: boolean
    banReason?: string | null
  }
}

interface VerificationRequestsListProps {
  initialRequests: VerificationRequest[]
}

export default function VerificationRequestsList({ initialRequests }: VerificationRequestsListProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const handleActionComplete = (action: string, requestId: string) => {
    // Remove the processed request from the list immediately for better UX
    setRequests(prev => prev.filter(req => req.id !== requestId))
    
    // Then refresh the data from server
    startTransition(() => {
      router.refresh()
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verifications</h3>
        <p className="text-gray-600">All verification requests have been processed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {requests.length} pending verification{requests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {request.User.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{request.User.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Submitted {formatDate(request.createdAt)}</span>
                  </div>
                  <a
                    href={request.cnicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View CNIC Document
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <VerificationActions
                  userId={request.User.id}
                  requestId={request.id}
                  userName={request.User.name}
                  userEmail={request.User.email}
                  isBanned={request.User.isBanned}
                  onActionComplete={handleActionComplete}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
