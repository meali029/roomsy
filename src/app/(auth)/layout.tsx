// src/app/(auth)/layout.tsx

"use client"

import { Suspense } from "react"
import RoomsyLoader from "@/components/shared/RoomsyLoader"

// Loading component for auth pages
function AuthPageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-mint-cream/50 to-white">
      <RoomsyLoader />
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<AuthPageLoader />}>
      <div className="min-h-screen">
        {children}
      </div>
    </Suspense>
  )
}
