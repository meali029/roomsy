// src/app/(auth)/register/page.tsx

"use client"

import { Suspense } from "react"
import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"
import { MotionDiv } from "@/components/shared/MotionWrapper"
import RoomsyLoader from "@/components/shared/RoomsyLoader"
import { ArrowLeft, Shield, Users, CheckCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

// Loading component for Suspense
function AuthPageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-mint-cream/50 to-white">
      <RoomsyLoader />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-mint-cream/50 to-white relative overflow-hidden auth-container">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-rich-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-soft-sage rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-deep-teal rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 lg:p-6">
        <Link href="/" className="inline-flex items-center text-rich-green hover:text-forest-teal transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12 order-2 lg:order-1 auth-container">
          <div className="w-full max-w-md block visible opacity-100 auth-form">
            <Suspense fallback={<AuthPageLoader />}>
              <MotionDiv direction="up" delay={0.2} className="block visible opacity-100 auth-form">
                <RegisterForm />
              </MotionDiv>
            </Suspense>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-deep-teal to-rich-green relative overflow-hidden order-1 lg:order-2">
          <div className="relative z-10 flex flex-col justify-center p-8 xl:p-12 text-white">
            <MotionDiv direction="up" className="max-w-lg">
              <h1 className="text-4xl xl:text-5xl font-bold mb-4 xl:mb-6 leading-tight">
                Join the
                <span className="text-mint-cream block">Roomsy Family</span>
              </h1>
              <p className="text-lg xl:text-xl text-white/90 mb-8 xl:mb-12 leading-relaxed">
                Start your journey to find the perfect roommate. Create your account and connect with thousands of verified users.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4 xl:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 xl:w-6 xl:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base xl:text-lg">100% Free to Join</h3>
                    <p className="text-white/80 text-sm xl:text-base">No hidden fees or charges</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-5 h-5 xl:w-6 xl:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base xl:text-lg">Verified Community</h3>
                    <p className="text-white/80 text-sm xl:text-base">Safe and trusted environment</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-5 h-5 xl:w-6 xl:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base xl:text-lg">Smart Matching</h3>
                    <p className="text-white/80 text-sm xl:text-base">Find compatible roommates easily</p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-mint-cream/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  )
}
