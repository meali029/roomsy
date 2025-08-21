"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  ArrowLeft,
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  HelpCircle,
  Send,
  MapPin,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  Home,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Headphones
} from "lucide-react"

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  })

  const supportCategories = [
    { id: "general", label: "General Help", icon: HelpCircle },
    { id: "account", label: "Account Issues", icon: Users },
    { id: "listings", label: "Listing Problems", icon: Home },
    { id: "payments", label: "Payment Support", icon: FileText },
    { id: "safety", label: "Safety & Security", icon: Shield },
    { id: "technical", label: "Technical Issues", icon: Settings }
  ]

  const faqs = [
    {
      id: 1,
      category: "general",
      question: "How do I create a listing on Roomsy?",
      answer: "To create a listing, sign in to your account and click 'Create Listing' in the navigation menu. Fill out all required information including photos, description, rent amount, and preferences. Submit your listing for review and it will be live within 24 hours."
    },
    {
      id: 2,
      category: "general",
      question: "How do I find compatible roommates?",
      answer: "Use our smart search filters to find roommates based on location, budget, lifestyle preferences, and profession. Our matching algorithm will show you the most compatible options first."
    },
    {
      id: 3,
      category: "account",
      question: "How do I verify my profile?",
      answer: "Go to your profile settings and upload a clear photo of your CNIC or passport. Our verification team will review and approve your profile within 2-3 business days. Verified profiles get priority in search results."
    },
    {
      id: 4,
      category: "account",
      question: "I forgot my password. How can I reset it?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a secure reset link. Follow the instructions in the email to create a new password."
    },
    {
      id: 5,
      category: "listings",
      question: "Why isn't my listing appearing in search results?",
      answer: "Make sure your listing is complete with all required fields, photos, and accurate location. Incomplete or unverified listings may not appear in search results. Contact support if the issue persists."
    },
    {
      id: 6,
      category: "payments",
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, debit cards, bank transfers, and mobile wallet payments including JazzCash and EasyPaisa for Pakistani users."
    },
    {
      id: 7,
      category: "safety",
      question: "How do you ensure user safety?",
      answer: "We verify all user profiles, provide secure messaging, offer safety guidelines, and have a 24/7 support team. Always meet in public places first and trust your instincts."
    },
    {
      id: 8,
      category: "technical",
      question: "The app is running slowly. What should I do?",
      answer: "Try clearing your browser cache, updating to the latest version, or restarting the app. If issues persist, contact our technical support team with details about your device and browser."
    }
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "Available 24/7",
      color: "from-rich-green to-forest-teal"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      available: "Response within 4 hours",
      color: "from-soft-sage to-mint-cream"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      action: "Call Now",
      available: "9 AM - 9 PM (PKT)",
      color: "from-deep-teal to-rich-green"
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Show success message or redirect
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory)

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
            <h1 className="text-xl md:text-2xl font-bold text-rich-green">Support Center</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-spacing py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rich-green to-soft-sage rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-rich-green mb-4">
            How can we help you today?
          </h2>
          <p className="text-lg text-rich-green/80 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or issues. 
            Browse our help resources or get in touch directly.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-rich-green mb-2">{method.title}</h3>
              <p className="text-rich-green/70 mb-4">{method.description}</p>
              <div className="text-sm text-rich-green/60 mb-4">{method.available}</div>
              <button className="w-full bg-rich-green text-white py-3 rounded-xl font-medium hover:bg-rich-green/90 transition-colors">
                {method.action}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-rich-green mb-6 flex items-center">
                <Send className="w-6 h-6 mr-3" />
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-rich-green mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rich-green/20 rounded-xl focus:outline-none focus:border-rich-green focus:ring-2 focus:ring-rich-green/10 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-rich-green mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rich-green/20 rounded-xl focus:outline-none focus:border-rich-green focus:ring-2 focus:ring-rich-green/10 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-rich-green mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rich-green/20 rounded-xl focus:outline-none focus:border-rich-green focus:ring-2 focus:ring-rich-green/10 transition-colors"
                    >
                      {supportCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-rich-green mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rich-green/20 rounded-xl focus:outline-none focus:border-rich-green focus:ring-2 focus:ring-rich-green/10 transition-colors"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-rich-green mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-rich-green/20 rounded-xl focus:outline-none focus:border-rich-green focus:ring-2 focus:ring-rich-green/10 transition-colors resize-none"
                    placeholder="Please provide as much detail as possible about your question or issue..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rich-green text-white py-4 rounded-xl font-semibold hover:bg-rich-green/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Quick Help */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-rich-green mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-rich-green" />
                  </div>
                  <div>
                    <div className="font-medium text-rich-green">Email</div>
                    <div className="text-sm text-rich-green/70">support@roomsy.pk</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-rich-green" />
                  </div>
                  <div>
                    <div className="font-medium text-rich-green">Phone</div>
                    <div className="text-sm text-rich-green/70">+92 300 123 4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mint-cream rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-rich-green" />
                  </div>
                  <div>
                    <div className="font-medium text-rich-green">Hours</div>
                    <div className="text-sm text-rich-green/70">24/7 Support Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-br from-mint-cream/50 to-soft-sage/30 border border-rich-green/20 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-rich-green mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Quick Help
              </h3>
              
              <div className="space-y-3">
                <Link href="/how-it-works" className="block p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="font-medium text-rich-green text-sm">How It Works</div>
                  <div className="text-xs text-rich-green/70">Learn how to use Roomsy</div>
                </Link>
                <Link href="/faq" className="block p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="font-medium text-rich-green text-sm">FAQ</div>
                  <div className="text-xs text-rich-green/70">Common questions answered</div>
                </Link>
                <Link href="/safety" className="block p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="font-medium text-rich-green text-sm">Safety Guidelines</div>
                  <div className="text-xs text-rich-green/70">Stay safe while using Roomsy</div>
                </Link>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Emergency Support
              </h3>
              <p className="text-sm text-red-600 mb-4">
                For urgent safety concerns or emergencies, contact us immediately.
              </p>
              <button className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
                Emergency Contact
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-rich-green text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {supportCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-rich-green text-white'
                    : 'bg-white text-rich-green border border-rich-green/20 hover:bg-rich-green/5'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={faq.id} className="bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-rich-green/5 transition-colors"
                >
                  <h4 className="text-lg font-medium text-rich-green pr-4">{faq.question}</h4>
                  {openFAQ === index ? (
                    <ChevronDown className="w-5 h-5 text-rich-green flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-rich-green flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-rich-green/80 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-16 bg-white/95 backdrop-blur-sm border border-rich-green/20 rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-rich-green mb-2">
            We&apos;re Here to Help
          </h3>
          <p className="text-rich-green/80 max-w-2xl mx-auto">
            Our average response time is under 4 hours for email support and instant for live chat. 
            We&apos;re committed to resolving your issues as quickly as possible.
          </p>
        </div>
      </div>
    </div>
  )
}
