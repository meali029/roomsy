"use client"

import Link from "next/link"
import { Star, Quote, ArrowLeft, Heart, Users, Home, CheckCircle } from "lucide-react"

export default function SuccessStoriesPage() {
  const successStories = [
    {
      id: 1,
      name: "Ayesha Khan",
      age: 22,
      profession: "Medical Student",
      university: "Dow University",
      city: "Karachi",
      image: "/assets/room-placeholder.jpg", // You can replace with actual user images
      story: "I was struggling to find a safe and affordable place near my university. Through Roomsy, I found the perfect roommate who is also a medical student. We've been living together for 8 months now and it's been an amazing experience!",
      rating: 5,
      duration: "8 months",
      savings: "Rs. 15,000/month",
      tags: ["Safe Environment", "Study Partner", "Cost Effective"]
    },
    {
      id: 2,
      name: "Muhammad Ali",
      age: 24,
      profession: "Software Engineer",
      university: "FAST University",
      city: "Lahore",
      image: "/assets/room-placeholder.jpg",
      story: "As a fresh graduate starting my career, I needed a place that was both affordable and close to my office. Roomsy helped me find a tech-savvy roommate who became not just a housemate but a great friend. We even started a small side project together!",
      rating: 5,
      duration: "1 year",
      savings: "Rs. 20,000/month",
      tags: ["Professional Network", "Friendship", "Career Growth"]
    },
    {
      id: 3,
      name: "Fatima Ahmed",
      age: 20,
      profession: "Business Student",
      university: "LUMS",
      city: "Lahore",
      image: "/assets/room-placeholder.jpg",
      story: "Moving to Lahore for my studies was scary, but Roomsy made it so much easier. I found a wonderful family environment with girls from similar backgrounds. We support each other in studies and have created lifelong friendships.",
      rating: 5,
      duration: "2 years",
      savings: "Rs. 18,000/month",
      tags: ["Family Environment", "Academic Support", "Lifelong Friends"]
    },
    {
      id: 4,
      name: "Hassan Malik",
      age: 26,
      profession: "Digital Marketer",
      university: "IBA Karachi",
      city: "Karachi",
      image: "/assets/room-placeholder.jpg",
      story: "After completing my MBA, I started working in Karachi. Roomsy connected me with working professionals who understand the work-life balance. Our shared apartment has become a hub of creativity and professional growth.",
      rating: 5,
      duration: "6 months",
      savings: "Rs. 25,000/month",
      tags: ["Professional Growth", "Work-Life Balance", "Creative Hub"]
    },
    {
      id: 5,
      name: "Zara Hussain",
      age: 21,
      profession: "Engineering Student",
      university: "NED University",
      city: "Karachi",
      image: "/assets/room-placeholder.jpg",
      story: "Being in engineering, I needed a quiet study environment. Through Roomsy, I found roommates who respect study hours and we've created the perfect academic atmosphere. My grades have improved significantly!",
      rating: 5,
      duration: "1.5 years",
      savings: "Rs. 12,000/month",
      tags: ["Study Environment", "Academic Excellence", "Mutual Respect"]
    },
    {
      id: 6,
      name: "Ahmed Raza",
      age: 23,
      profession: "Content Creator",
      university: "PU",
      city: "Lahore",
      image: "/assets/room-placeholder.jpg",
      story: "As a content creator, I needed a space that was both affordable and inspiring. My roommate through Roomsy is also in the creative field. We collaborate on projects and have built a mini studio in our apartment!",
      rating: 5,
      duration: "10 months",
      savings: "Rs. 16,000/month",
      tags: ["Creative Collaboration", "Inspiring Space", "Professional Network"]
    }
  ]

  const stats = [
    { number: "10,000+", label: "Successful Matches", icon: Heart },
    { number: "500+", label: "Happy Communities", icon: Users },
    { number: "25+", label: "Cities Covered", icon: Home },
    { number: "98%", label: "Success Rate", icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-sage/5 via-mint-cream/10 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rich-green/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto container-spacing py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-rich-green hover:text-rich-green/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-rich-green">Success Stories</h1>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-spacing py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-rich-green mb-6">
            Real Stories, Real Success
          </h2>
          <p className="text-lg md:text-xl text-rich-green/80 max-w-3xl mx-auto mb-8">
            Discover how Roomsy has transformed the lives of thousands of students and professionals across Pakistan. 
            From finding the perfect roommate to building lifelong friendships, these are their stories.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-rich-green to-soft-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-rich-green mb-2">{stat.number}</div>
              <div className="text-sm md:text-base text-rich-green/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories Grid */}
        <div className="space-y-8">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-8">
            Inspiring Journeys
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-rich-green to-soft-sage rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {story.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-rich-green">{story.name}</h4>
                    <p className="text-sm text-rich-green/70">{story.profession}</p>
                    <p className="text-xs text-rich-green/60">{story.university}, {story.city}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-rich-green/20 absolute -top-2 -left-2" />
                  <p className="text-rich-green/80 leading-relaxed pl-6 italic">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-mint-cream text-rich-green text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-rich-green/10">
                  <div className="text-center">
                    <div className="text-lg font-bold text-rich-green">{story.duration}</div>
                    <div className="text-xs text-rich-green/70">Living Together</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-rich-green">{story.savings}</div>
                    <div className="text-xs text-rich-green/70">Monthly Savings</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 border border-rich-green/20 rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-lg text-rich-green/80 mb-8 max-w-2xl mx-auto">
            Join thousands of happy users who found their perfect living situation through Roomsy. 
            Your success story could be next!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="btn-rich text-lg py-4 px-8"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/listing" 
              className="btn-secondary text-lg py-4 px-8"
            >
              Browse Listings
            </Link>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-8">
            <Quote className="w-12 h-12 text-rich-green/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium text-rich-green/90 italic mb-6">
              &ldquo;Roomsy didn&apos;t just help me find a place to live; it helped me find a home, friends, and a community that supported my dreams.&rdquo;
            </blockquote>
            <div className="text-rich-green/70">
              <div className="font-semibold">Sarah Khan</div>
              <div className="text-sm">MBA Student, IBA Karachi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
