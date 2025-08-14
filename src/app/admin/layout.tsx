import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/libs/auth"
import AdminSidebar from "@/components/navbar/AdminSidebar"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated and has admin role
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
                <Link
                  href="/api/auth/signout"
                  className="text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </Link>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
