"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Support", href: "/support" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Roomsy.pk
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              <Link
                href="/listing/create"
                className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700"
              >
                + Create Listing
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium"
              >
                {session.user.name?.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-full"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
