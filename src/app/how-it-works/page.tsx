"use client"

import Link from "next/link"
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  MessageCircle, 
  Home, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Users,
  MapPin,
  Star,
  Clock,
  Phone,
  Camera,
  Eye
} from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Sign Up & Create Profile",
      description: "Create your account and build a detailed profile with your preferences, location, and lifestyle.",
      icon: UserPlus,
      details: [
        "Quick registration process",
        "Add photos and personal details",
        "Specify your preferences",
        "Verify your profile for trust"
      ],
      color: "from-rich-green to-forest-teal"
    },
    {
      id: 2,
      title: "Search & Filter",
      description: "Browse listings or potential roommates using our smart filters for location, budget, and lifestyle.",
      icon: Search,
      details: [
        "Advanced search filters",
        "Location-based results",
        "Budget and preference matching",
        "Real-time availability updates"
      ],
      color: "from-soft-sage to-mint-cream"
    },
    {
      id: 3,
      title: "Connect & Chat",
      description: "Message potential roommates or property owners securely through our platform.",
      icon: MessageCircle,
      details: [
        "Secure in-app messaging",
        "Share contact details safely",
        "Schedule virtual or in-person meetings",
        "Get to know each other better"
      ],
      color: "from-deep-teal to-rich-green"
    },
    {
      id: 4,
      title: "Find Your Home",
      description: "Finalize your living arrangement and move into your perfect shared space.",
      icon: Home,
      details: [
        "Agree on terms and conditions",
        "Complete the booking process",
        "Move in with confidence",
        "Build lasting relationships"
      ],
      color: "from-mint-cream to-soft-sage"
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All users go through our verification process for your safety and peace of mind."
    },
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description: "Find roommates and properties in your preferred areas across Pakistan."
    },
    {
      icon: Users,
      title: "Smart Compatibility",
      description: "Our algorithm matches you with compatible roommates based on lifestyle and preferences."
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description: "Chat safely within our platform before sharing personal contact information."
    },
    {
      icon: Star,
      title: "Review System",
      description: "Read and leave reviews to help build a trustworthy community."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you with any questions."
    }
  ]

  const tips = [
    {
      category: "Profile Tips",
      icon: Camera,
      items: [
        "Use clear, recent photos",
        "Write a detailed bio",
        "Be honest about your lifestyle",
        "Complete all profile sections"
      ]
    },
    {
      category: "Search Tips",
      icon: Eye,
      items: [
        "Use specific location filters",
        "Set realistic budget ranges",
        "Consider commute distances",
        "Check availability dates"
      ]
    },
    {
      category: "Communication Tips",
      icon: Phone,
      items: [
        "Ask about daily routines",
        "Discuss house rules early",
        "Meet in public places first",
        "Trust your instincts"
      ]
    },
    {
      category: "Safety Tips",
      icon: Shield,
      items: [
        "Verify profile information",
        "Never send money upfront",
        "Visit the property in person",
        "Read all terms carefully"
      ]
    }
  ]

  const faqs = [
    {
      question: "Is Roomsy free to use?",
      answer: "Yes! Creating an account, browsing listings, and messaging other users is completely free. We only charge a small service fee when you successfully find and book a place."
    },
    {
      question: "How do you verify profiles?",
      answer: "We verify profiles through phone number confirmation, ID verification, and social media links. Verified profiles get a blue checkmark for added trust."
    },
    {
      question: "What if I have issues with my roommate?",
      answer: "Our customer support team is here to help mediate any issues. We also provide guidelines for healthy roommate relationships and conflict resolution."
    },
    {
      question: "Can I list my property on Roomsy?",
      answer: "Absolutely! Property owners can create listings for free and connect with verified tenants looking for shared accommodation."
    },
    {
      question: "How do I know if someone is a good roommate match?",
      answer: "Our compatibility algorithm considers lifestyle preferences, schedules, cleanliness habits, and social preferences to suggest the best matches."
    }
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
            <h1 className="text-xl md:text-2xl font-bold text-rich-green">How It Works</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-spacing py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-rich-green mb-6">
            Finding Your Perfect Roommate Made Simple
          </h2>
          <p className="text-lg md:text-xl text-rich-green/80 max-w-3xl mx-auto mb-8">
            Discover how easy it is to find compatible roommates and shared accommodation 
            through our secure, user-friendly platform designed for students and professionals.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-12">
            Four Simple Steps to Your New Home
          </h3>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Step Card */}
                  <div className="flex-1 bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-rich-green mb-2">
                          Step {step.id}: {step.title}
                        </h4>
                        <p className="text-rich-green/80 mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm text-rich-green/70">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step Number */}
                  <div className="w-24 h-24 bg-gradient-to-br from-rich-green to-soft-sage rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                    {step.id}
                  </div>
                </div>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center mt-8">
                    <ArrowRight className="w-8 h-8 text-rich-green/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-12">
            Why Choose Roomsy?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-rich-green to-soft-sage rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-rich-green mb-3">{feature.title}</h4>
                <p className="text-rich-green/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-12">
            Pro Tips for Success
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 border border-rich-green/20 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-rich-green rounded-lg flex items-center justify-center">
                    <tip.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-rich-green">{tip.category}</h4>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-rich-green/80">
                      <div className="w-1.5 h-1.5 bg-rich-green rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-rich-green mb-3">{faq.question}</h4>
                <p className="text-rich-green/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-rich-green to-soft-sage rounded-2xl shadow-lg p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students and professionals who have found their perfect living situation through Roomsy. 
            Your ideal roommate is just a few clicks away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-white text-rich-green px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors text-lg"
            >
              Create Free Account
            </Link>
            <Link 
              href="/listing" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-lg"
            >
              Browse Listings
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-rich-green mb-4">
            Still Have Questions?
          </h3>
          <p className="text-rich-green/70 mb-6">
            Our support team is here to help you every step of the way.
          </p>
          <Link 
            href="/support" 
            className="inline-flex items-center space-x-2 text-rich-green hover:text-rich-green/80 font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
