import "./globals.css"
import { Poppins, Inter } from "next/font/google"
import { Providers } from "./Providers"
import ConditionalLayout from "../components/shared/ConditionalLayout"
import Script from "next/script"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap'
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: "Roomsy.pk – Find Trusted Roommates",
  description: "Roomsy helps university students and professionals find roommates, safely and smartly.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          {googleMapsKey ? (
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`}
              strategy="afterInteractive"
            />
          ) : null}
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
