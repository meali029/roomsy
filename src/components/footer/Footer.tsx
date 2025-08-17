// src/components/footer/Footer.tsx

import Link from "next/link"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  Award, 
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  ArrowUp
} from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-darkest-green via-deep-teal to-forest-teal text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-mint-cream rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-soft-sage rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto container-spacing">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <Link href="/" className="inline-flex items-center group">
                  <div className="w-12 h-12 bg-mint-cream rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-rich-green" />
                  </div>
                  <span className="text-3xl font-bold text-mint-cream">Roomsy</span>
                </Link>
              </div>
              
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-md">
                Pakistan&apos;s most trusted platform for finding safe, verified roommates. 
                Connecting students and professionals across major cities with smart matching technology.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-white/80">
                  <MapPin className="w-5 h-5 mr-3 text-mint-cream" />
                  <span>Lahore, Karachi, Islamabad & 20+ Cities</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Mail className="w-5 h-5 mr-3 text-mint-cream" />
                  <a href="mailto:support@roomsy.pk" className="hover:text-mint-cream transition-colors">
                    support@roomsy.pk
                  </a>
                </div>
                <div className="flex items-center text-white/80">
                  <Phone className="w-5 h-5 mr-3 text-mint-cream" />
                  <a href="tel:+923001234567" className="hover:text-mint-cream transition-colors">
                    +92 300 123 4567
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 glass-mint rounded-xl flex items-center justify-center text-rich-green hover:scale-110 hover:rotate-12 transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-mint-cream mb-6 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Browse Listings", href: "/listing" },
                  { label: "Post Listing", href: "/listing/create" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Find Roommates", href: "/listing" },
                  { label: "Success Stories", href: "/stories" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-white/80 hover:text-mint-cream transition-colors hover:translate-x-2 transform duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-mint-cream mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Support
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Help Center", href: "/support" },
                  { label: "Safety Guide", href: "/safety" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Contact Us", href: "/support" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-white/80 hover:text-mint-cream transition-colors hover:translate-x-2 transform duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust & Stats */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-bold text-mint-cream mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Trusted Platform
              </h3>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {[
                  { icon: Shield, title: "SSL Secured", desc: "256-bit encryption" },
                  { icon: Award, title: "Verified Users", desc: "Identity checked" },
                  { icon: Heart, title: "Safe Community", desc: "Trusted by thousands" }
                ].map((badge, index) => (
                  <div key={index} className="glass-mint p-4 rounded-xl text-rich-green hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                      <badge.icon className="w-6 h-6 mr-3" />
                      <div>
                        <div className="font-semibold text-sm">{badge.title}</div>
                        <div className="text-xs opacity-80">{badge.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="glass-mint p-6 rounded-xl text-rich-green">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">10,000+</div>
                  <div className="text-sm opacity-80">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="relative z-10 mx flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-white/80 text-sm mb-2">
                © 2025 Roomsy.pk. All rights reserved.
              </p>
              <p className="text-white/60 text-xs">
                Made with <Heart className="w-3 h-3 inline text-mint-cream" /> in Pakistan
              </p>
            </div>

            {/* App Download Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm font-medium">Download App:</span>
              <div className="flex space-x-3">
                <button className="glass-mint px-4 py-2 rounded-lg text-rich-green text-xs font-medium hover:scale-105 transition-transform duration-300">
                  Coming Soon - App Store
                </button>
                <button className="glass-mint px-4 py-2 rounded-lg text-rich-green text-xs font-medium hover:scale-105 transition-transform duration-300">
                  Coming Soon - Play Store
                </button>
              </div>
            </div>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="glass-mint p-3 rounded-xl text-rich-green hover:scale-110 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Faded Roomsy Watermark - Bottom Edge Effect */}
          <div
            className="relative w-full flex justify-center items-end select-none overflow-hidden px-0 mx-0 "
            style={{ 
              height: 'clamp(115px, 11vh, 260px)', // Responsive height
              paddingTop: '0.1rem',
            }}
          >
            {/* Fog effect overlay */}
            <div className="absolute bottom-0 w-screen h-1/2 bg-gradient-to-t from-forest-teal to-transparent z-10"></div>
            
            <div
              className="absolute m-0 p-0 bottom-0 left-0 right-0 flex justify-center text-[19vw] sm:text-[17vw] md:text-[14vw] lg:text-[11vw] xl:text-[9vw] 2xl:text-[8vw] font-extrabold tracking-widest px-0"
              style={{
                lineHeight: 0.7, // Brings text closer to bottom
                opacity: 0.9,
              }}
            >
              {"ROOMSY".split('').map((letter, index) => (
                <span
                  key={index}
                  className={`
                    text-transparent 
                    bg-clip-text 
                   pt-1
                    bg-gradient-to-r 
                    from-mint-cream via-white to-soft-sage 
                    bg-[length:200%_100%] 
                    bg-[position:center] 
                    transition-all 
                    duration-1000 
                    ease-[cubic-bezier(0.65,0.05,0.36,1)]
                    relative
                  `}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
