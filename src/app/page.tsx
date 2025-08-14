// src/app/page.tsx

"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import RoomsyLoader from "../components/shared/RoomsyLoader"
import { MotionDiv, MotionSection, FloatingElement, GlowingElement } from "../components/shared/MotionWrapper"
import { useListings } from "../hooks/useListings"
import { 
  Shield, 
  Users, 
  MessageCircle, 
  Star, 
  CheckCircle,
  Sparkles,
  Heart,
  TrendingUp,
  Clock,
  Award,
  Zap,
  MapPin,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"

// Carousel images with captions
const carouselItems = [
  {
    image: "/assets/roomsy-hero.png",
    caption: "Safe & Verified",
    description: "All users are identity verified for your safety"
  },
  {
    image: "/assets/roomsy-hero.png",
    caption: "Nationwide Coverage",
    description: "Find roommates in over 20+ cities across Pakistan"
  },
  {
    image: "/assets/roomsy-hero.png",
    caption: "Trusted by Thousands",
    description: "Join 10,000+ happy users who found their perfect match"
  }
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Fetch featured listings (limit to 4 for homepage)
  const { listings: featuredListings, loading: listingsLoading, error: listingsError } = useListings(4)
  
  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }
  
  if (status === "loading") {
    return <RoomsyLoader />
  }

  return (
    <>
      {/* Hero Section - Unified for all users */}
      <section className="relative section-spacing container-spacing max-w-7xl mx-auto text-center overflow-hidden">
        <MotionDiv direction="fade" className="max-w-5xl mx-auto relative z-10">
          <MotionDiv direction="up" delay={0.2}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
              Find Your Perfect
              <span className="text-rich-green block mt-2">
                Roommate
              </span>
            </h1>
          </MotionDiv>
          
          <MotionDiv direction="up" delay={0.4}>
            <p className="text-xl sm:text-2xl text-black/70 max-w-4xl mx-auto mb-12 leading-relaxed">
              {session 
                ? `Welcome back, ${session.user?.name?.split(' ')[0] || 'Friend'}! Ready to find your next match?`
                : "Join thousands of students & professionals finding their perfect roommate."
              }
            </p>
          </MotionDiv>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
            <Link 
              href={session ? "/listing/create" : "/register"} 
              className="btn-rich text-lg py-5 px-10"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              {session ? "List Your Space" : "Sign Up Free"}
            </Link>
            <Link href="/listing" className="btn-sage text-lg py-5 px-10">
              <Users className="w-5 h-5 inline mr-2" />
              Browse Listings
            </Link>
          </div>
        </MotionDiv>

        {/* Floating Hero Image */}
        <FloatingElement delay={0.8}>
          <MotionDiv direction="up" delay={0.8} className="relative max-w-6xl mx-auto">
            <div className="relative">
              <Image
                src="/assets/roomsy-hero.png"
                alt="Roomsy flat sharing community"
                width={1200}
                height={600}
                className="w-full rounded-xl shadow-deep-teal"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute top-8 left-8 glass-mint p-4 rounded-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-soft-sage rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-black">10,000+ Active Users</span>
                </div>
              </div>
              
              <div className="absolute bottom-8 right-8 glass-sage p-4 rounded-xl" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-rich-green fill-current" />
                  <span className="text-sm font-medium text-white">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </MotionDiv>
        </FloatingElement>
      </section>

      {/* Featured Listings Section */}
      <MotionSection className="section-spacing bg-mint-cream/30">
        <div className="max-w-7xl mx-auto container-spacing">
          <MotionDiv direction="up" className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Featured Listings
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
              Discover the latest verified listings from our trusted community
            </p>
          </MotionDiv>
          
          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card-mint p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : listingsError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <p className="text-lg">Failed to load listings</p>
                <p className="text-sm text-black/70">{listingsError}</p>
              </div>
              <Link href="/listing" className="btn-sage text-lg py-4 px-8">
                <ExternalLink className="w-5 h-5 inline mr-2" />
                View All Listings
              </Link>
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-black/70 mb-6">
                <p className="text-xl mb-2">No listings available yet</p>
                <p>Be the first to create a listing!</p>
              </div>
              <Link href="/listing/create" className="btn-rich text-lg py-4 px-8">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Create First Listing
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {featuredListings.map((listing, index) => (
                  <MotionDiv 
                    key={listing.id}
                    direction="up" 
                    delay={0.2 + index * 0.1}
                    className="group"
                  >
                    <div className="card-mint overflow-hidden group-hover:scale-105 transition-all duration-300 h-full">
                      <div className="relative">
                        <Image
                          src={listing.imageUrls?.[0] || "/assets/room-placeholder.jpg"}
                          alt={listing.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          {listing.user.isVerified && (
                            <div className="glass-sage p-2 rounded-full">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 glass-mint px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-black">{listing.genderPreference || 'Any'}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-black mb-2 text-lg group-hover:text-rich-green transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-black/70 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{listing.location || listing.city}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-rich-green font-semibold">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>Rs {listing.rent.toLocaleString()}/month</span>
                          </div>
                          <Link 
                            href={`/listing/${listing.id}`}
                            className="text-rich-green hover:text-forest-teal transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
              
              <MotionDiv direction="up" delay={0.8} className="text-center">
                <Link href="/listing" className="btn-sage text-lg py-4 px-8">
                  <ExternalLink className="w-5 h-5 inline mr-2" />
                  View All Listings
                </Link>
              </MotionDiv>
            </>
          )}
        </div>
      </MotionSection>

      {/* Carousel Section */}
      <MotionSection className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-spacing">
          <div className="relative overflow-hidden rounded-xl">
            <div className="relative h-96 md:h-[500px]">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div className="max-w-2xl px-6">
                      <h3 className="text-4xl md:text-5xl font-bold mb-4">{item.caption}</h3>
                      <p className="text-xl md:text-2xl text-white/90">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-mint p-3 rounded-full hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-mint p-3 rounded-full hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Why Choose Roomsy Section */}
      <MotionSection className="section-spacing bg-mint-cream/30">
        <div className="max-w-7xl mx-auto container-spacing text-center">
          <MotionDiv direction="up">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Why Choose Roomsy?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto mb-20 leading-relaxed">
              We make finding the perfect roommate safe, simple, and stress-free with cutting-edge technology.
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                description: "All users go through identity verification to ensure safety and trust in our community.",
                color: "forest-teal"
              },
              {
                icon: Zap,
                title: "Smart Matching",
                description: "Find compatible roommates based on lifestyle, budget, location preferences, and more.",
                color: "deep-teal"
              },
              {
                icon: Heart,
                title: "24/7 Support",
                description: "Our dedicated support team is here to help you every step of the way.",
                color: "forest-teal"
              }
            ].map((feature, index) => (
              <MotionDiv 
                key={index}
                direction="up" 
                delay={0.2 + index * 0.2}
                className="group"
              >
                <div className="card-mint p-10 text-center group-hover:scale-105 transition-all duration-300 h-full">
                  
                    <div className={`w-20 h-20 rounded-xl bg-${feature.color} flex items-center justify-center text-white mx-auto mb-8 shadow-soft group-hover:scale-110 transition-all duration-300 hover:brightness-110`}>
                      <feature.icon className="w-10 h-10" />
                    </div>
                 
                  <h3 className="text-2xl font-semibold text-black mb-6">{feature.title}</h3>
                  <p className="text-black/70 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Tips Section */}
      <MotionSection className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-spacing">
          <MotionDiv direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">
              {session ? "Personalized Tips for You" : "Tips for Success"}
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
              {session 
                ? "Make the most of your Roomsy experience with these personalized recommendations"
                : "Follow these proven strategies to find your ideal living situation"
              }
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: CheckCircle,
                title: session ? "Update Your Profile" : "Complete Your Profile",
                description: session 
                  ? "Add more photos and update your preferences to get 3x more matches"
                  : "Add photos and detailed information to attract the right roommates",
                color: "deep-teal"
              },
              {
                icon: MessageCircle,
                title: "Communicate Clearly",
                description: session
                  ? "Send personalized messages to increase your response rate by 60%"
                  : "Be honest about your lifestyle and expectations from the start",
                color: "soft-sage"
              },
              {
                icon: Shield,
                title: session ? "Stay Active & Verified" : "Get Verified",
                description: session
                  ? "Verified users receive 5x more inquiries than unverified profiles"
                  : "Complete identity verification for better trust and visibility",
                color: "forest-teal"
              },
              {
                icon: Award,
                title: "Use Smart Filters",
                description: session
                  ? "Try expanding your search radius to find 40% more potential matches"
                  : "Filter by location, budget, and preferences to find compatible matches",
                color: "rich-green"
              }
            ].map((tip, index) => (
              <div 
                key={index}
                className="flex items-start space-x-6 p-8 rounded-xl hover:bg-mint-cream/30 transition-all duration-300 group"
              >
                <div className={`p-4 rounded-xl shadow-soft group-hover:scale-110 transition-all duration-300 ${
                  tip.color === 'deep-teal' ? 'bg-deep-teal text-white hover:brightness-110' :
                  tip.color === 'soft-sage' ? 'bg-soft-sage text-white hover:brightness-110' :
                  tip.color === 'forest-teal' ? 'bg-forest-teal text-white hover:brightness-110' :
                  'bg-rich-green text-white hover:brightness-110'
                }`}>
                  <tip.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-3 text-xl">{tip.title}</h3>
                  <p className="text-black/70 leading-relaxed text-lg">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Statistics & Trust Section */}
      <MotionSection className="section-spacing bg-rich-green text-white">
        <div className="max-w-7xl mx-auto container-spacing text-center">
          <MotionDiv direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-16">
              Trusted by Thousands Across Pakistan
            </h2>
          </MotionDiv>
          
          <div  className="flex flex-col md:flex-row lg:flex-row justify-center items-center gap-6 lg:gap-8 mb-16 overflow-x-auto">
            {[
              { icon: Shield, label: "Identity Verified" },
              { icon: Clock, label: "24/7 Available" },
              { icon: Award, label: "Top Rated Platform" }
            ].map((badge, index) => (
              <div key={index} className="glass-mint text-black p-6 lg:p-8 rounded-xl flex flex-col items-center font-medium transition-all duration-300 min-h-[160px] lg:min-h-[180px] justify-center flex-shrink-0 w-48 lg:w-72">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-rich-green/10 rounded-xl flex items-center justify-center mb-3 lg:mb-4 transition-transform duration-300">
                  <badge.icon className="w-6 h-6 lg:w-8 lg:h-8 text-rich-green" />
                </div>
                <span className="text-base lg:text-lg font-semibold text-center">{badge.label}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "5K+", label: "Successful Matches" },
              { number: "20+", label: "Cities Covered" },
              { number: "99%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <MotionDiv key={index} direction="up" delay={0.4 + index * 0.1}>
                <div className="text-5xl font-bold text-mint-cream mb-3 hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium text-lg">{stat.label}</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Final Call to Action Section */}
      <MotionSection className="section-spacing bg-mint-cream/50 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto container-spacing text-center">
          <MotionDiv direction="up">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-8">
              {session 
                ? "Ready to Explore New Matches?" 
                : "Ready to Find Your Perfect Roommate?"
              }
            </h2>
            <p className="text-xl text-black/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              {session
                ? "Discover new potential roommates and expand your connections today"
                : "Join thousands of students and professionals who have found their ideal living situation through Roomsy"
              }
            </p>
          </MotionDiv>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href={session ? "/listing" : "/register"}
              className="btn-rich text-lg py-5 px-10"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              {session ? "Explore New Matches" : "Sign Up Free Today"}
            </Link>
            {!session && (
              <Link
                href="/login"
                className="btn-sage text-lg py-5 px-10"
              >
                Already Have Account?
              </Link>
            )}
          </div>
        </div>
      </MotionSection>
    </>
  )
}
