"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Verifications", href: "/admin/verifications" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex h-screen w-64 fixed top-0 left-0 bg-gray-900 text-white flex-col shadow-md z-40">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Roomsy Admin
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
