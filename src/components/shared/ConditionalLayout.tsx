"use client"

import { usePathname } from "next/navigation"
import Navbar from "../navbar/Navbar"
import MobileBottomNav from "../navbar/MobileBottomNav"
import ConditionalFooter from "./ConditionalFooter"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Hide navbar and footer on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register"
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={`min-h-screen bg-background overflow-x-hidden ${!isAuthPage ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <ConditionalFooter />}
      {!isAuthPage && <MobileBottomNav />}
    </>
  )
}
