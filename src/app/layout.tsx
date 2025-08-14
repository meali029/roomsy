import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./Providers"
import Navbar from "../components/navbar/Navbar"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Roomsy.pk – Find Trusted Roommates",
  description: "Roomsy helps university students and professionals find roommates, safely and smartly.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return (
    <html lang="en">
      <body className={inter?.className ?? ""}>
        <Providers>
          <Navbar />
          {googleMapsKey ? (
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`}
              strategy="afterInteractive"
            />
          ) : null}
          <main className="min-h-screen pt-16 px-4 md:px-8 bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
