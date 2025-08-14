"use client"

export const dynamic = 'force-dynamic'

import React from 'react'

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top navigation, fill out the required information, and verify your email address to activate your account."
    },
    {
      question: "How do I post a room listing?",
      answer: "After logging in, click on 'Create Listing' in the navigation menu. Fill out all the required details about your room, upload photos, and publish your listing."
    },
    {
      question: "Is there a fee for using Roomsy?",
      answer: "Basic account creation and browsing listings is free. We may charge fees for premium features or promoted listings in the future."
    },
    {
      question: "How do I contact other users?",
      answer: "You can contact other users through our secure messaging system. Click on any listing and use the contact form to send a message to the listing owner."
    },
    {
      question: "How do I edit my profile?",
      answer: "Navigate to your dashboard by clicking on your profile icon, then select 'Profile' to update your personal information, preferences, and profile picture."
    },
    {
      question: "What if I have safety concerns?",
      answer: "Your safety is our priority. Always meet potential roommates in public places, verify their identity, and report any suspicious behavior to our support team."
    },
    {
      question: "How do I delete my account?",
      answer: "Contact our support team at support@roomsy.pk to request account deletion. Please note that this action is permanent and cannot be undone."
    },
    {
      question: "Can I edit or delete my listing?",
      answer: "Yes, you can edit or delete your listings from your dashboard. Navigate to 'My Listings' to manage all your posted rooms."
    }
  ]

  return (
    <div className="section-spacing container-spacing max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800 mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Everything you need to know about using Roomsy.pk to find your perfect roommate
        </p>
      </div>
      
      {/* FAQ Items */}
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="card p-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-start">
              <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                {index + 1}
              </span>
              {faq.question}
            </h2>
            <p className="text-neutral-700 leading-relaxed ml-12">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="card p-8 mt-12 text-center bg-primary-50 border-2 border-primary-100">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Still have questions?</h2>
        <p className="text-neutral-600 mb-6 max-w-lg mx-auto">
          If you can&apos;t find the answer you&apos;re looking for, our support team is here to help you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/support" 
            className="btn-primary"
          >
            Visit Support Center
          </a>
          <a 
            href="mailto:support@roomsy.pk" 
            className="btn-secondary"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  )
}
