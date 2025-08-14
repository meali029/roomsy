"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Footer from "../footer/Footer"

interface SessionUser {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export default function ConditionalFooter() {
  const { data: session } = useSession()
  const pathname = usePathname() || ""
  const isAdmin = (session?.user as SessionUser)?.role === "ADMIN"

  // Don't show footer for admin users on admin pages
  if (isAdmin && pathname.startsWith('/admin')) {
    return null
  }

  return <Footer />
}
